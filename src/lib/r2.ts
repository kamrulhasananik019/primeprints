import { AwsClient } from 'aws4fetch';

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function encodeObjectKey(key: string): string {
  return key
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

function getR2Config() {
  const accountId = getRequiredEnv('R2_ACCOUNT_ID');
  const bucket = getRequiredEnv('R2_BUCKET');
  const accessKeyId = getRequiredEnv('R2_ACCESS_KEY_ID');
  const secretAccessKey = getRequiredEnv('R2_SECRET_ACCESS_KEY');
  const publicBaseUrl = process.env.R2_PUBLIC_URL?.trim() || null;

  const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;

  return {
    accountId,
    bucket,
    accessKeyId,
    secretAccessKey,
    publicBaseUrl,
    endpoint,
  };
}

function getS3PathUrl(key: string) {
  const { endpoint, bucket } = getR2Config();
  return `${endpoint}/${bucket}/${encodeObjectKey(key)}`;
}

function createR2Client() {
  const { accessKeyId, secretAccessKey } = getR2Config();

  return new AwsClient({
    accessKeyId,
    secretAccessKey,
    service: 's3',
    region: 'auto',
  });
}

function sanitizeFilename(filename: string): string {
  return filename
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function extensionFromMimeType(mimeType: string): string {
  if (mimeType.startsWith('image/')) {
    const ext = mimeType.split('/')[1];
    return ext === 'jpeg' ? 'jpg' : ext;
  }

  if (mimeType.startsWith('video/')) {
    return mimeType.split('/')[1];
  }

  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType === 'text/plain') return 'txt';
  if (mimeType === 'application/zip') return 'zip';
  if (mimeType === 'application/json') return 'json';

  return 'bin';
}

type BuildObjectKeyOptions = {
  folder?: string;
  originalName?: string;
  mimeType?: string;
};

export function buildR2ObjectKey({
  folder = 'uploads',
  originalName = 'file',
  mimeType = '',
}: BuildObjectKeyOptions) {
  const normalizedFolder = folder.replace(/^\/+|\/+$/g, '') || 'uploads';
  const safeName = sanitizeFilename(originalName);

  const hasExtension = safeName.includes('.');
  const extension = hasExtension
    ? ''
    : `.${extensionFromMimeType(mimeType.toLowerCase())}`;

  return `${normalizedFolder}/${Date.now()}-${crypto.randomUUID()}-${safeName || 'file'}${extension}`;
}

export async function uploadObjectToR2(options: {
  key: string;
  body: ArrayBuffer;
  contentType?: string;
  cacheControl?: string;
  contentLength?: number;
}) {
  const { key, body, contentType, cacheControl, contentLength } = options;
  const client = createR2Client();

  const response = await client.fetch(getS3PathUrl(key), {
    method: 'PUT',
    headers: {
      'Content-Type': contentType || 'application/octet-stream',
      ...(cacheControl ? { 'Cache-Control': cacheControl } : {}),
      ...(contentLength ? { 'Content-Length': String(contentLength) } : {}),
    },
    body,
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`R2 upload failed (${response.status}): ${details || 'Unknown error'}`);
  }

  return {
    key,
    url: getR2PublicUrl(key),
  };
}

export async function deleteObjectFromR2(key: string) {
  const client = createR2Client();

  const response = await client.fetch(getS3PathUrl(key), {
    method: 'DELETE',
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`R2 delete failed (${response.status}): ${details || 'Unknown error'}`);
  }
}

export function getR2PublicUrl(key: string): string {
  const { publicBaseUrl, endpoint, bucket } = getR2Config();
  const base = publicBaseUrl || `${endpoint}/${bucket}`;
  return `${base.replace(/\/$/, '')}/${encodeObjectKey(key)}`;
}

export function getMaxUploadBytes(): number {
  const rawValue = process.env.R2_MAX_UPLOAD_BYTES;
  if (!rawValue) return 100 * 1024 * 1024;

  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 100 * 1024 * 1024;
  }

  return parsed;
}
