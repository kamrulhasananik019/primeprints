const encoder = new TextEncoder();

export const ADMIN_SESSION_COOKIE_NAME = 'admin_session';

export type AdminSession = {
  sub: string;
  email: string;
  exp: number;
};

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function toBase64Url(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(base64Url: string): string {
  const withPadding = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = withPadding.length % 4;
  if (pad === 0) return withPadding;
  return withPadding + '='.repeat(4 - pad);
}

function encodeBase64UrlText(text: string): string {
  return toBase64Url(bytesToBase64(encoder.encode(text)));
}

function decodeBase64UrlText(value: string): string {
  const bytes = base64ToBytes(fromBase64Url(value));
  return new TextDecoder().decode(bytes);
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function getRequiredSecret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) {
    throw new Error('Missing required environment variable: ADMIN_SESSION_SECRET');
  }
  return value;
}

export function getAdminSessionTtlSeconds(): number {
  const value = Number.parseInt(process.env.ADMIN_SESSION_TTL_SECONDS ?? '28800', 10);
  if (!Number.isFinite(value) || value <= 0) {
    return 28800;
  }
  return value;
}

async function signText(text: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(text));
  return toBase64Url(bytesToBase64(new Uint8Array(signature)));
}

export async function createAdminSessionToken(sub: string, email: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + getAdminSessionTtlSeconds();
  const payload: AdminSession = { sub, email, exp };
  const payloadPart = encodeBase64UrlText(JSON.stringify(payload));
  const signaturePart = await signText(payloadPart, getRequiredSecret());
  return `${payloadPart}.${signaturePart}`;
}

export async function verifyAdminSessionToken(token: string): Promise<AdminSession | null> {
  const [payloadPart, signaturePart] = token.split('.');
  if (!payloadPart || !signaturePart) {
    return null;
  }

  const expectedSignature = await signText(payloadPart, getRequiredSecret());
  if (!safeEqual(signaturePart, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64UrlText(payloadPart)) as Partial<AdminSession>;
    if (!payload.sub || !payload.email || typeof payload.exp !== 'number') {
      return null;
    }

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}