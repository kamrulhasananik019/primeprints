import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'primeprints_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.PAYLOAD_SECRET || 'change-me-admin-session-secret';
}

type SessionPayload = {
  email: string;
  exp: number;
};

function toBase64Url(input: string): string {
  return Buffer.from(input).toString('base64url');
}

function fromBase64Url(input: string): string {
  return Buffer.from(input, 'base64url').toString('utf8');
}

function sign(value: string): string {
  return createHmac('sha256', getSecret()).update(value).digest('base64url');
}

export function createAdminSession(email: string): string {
  const payload: SessionPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encoded = toBase64Url(JSON.stringify(payload));
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifyAdminSession(token: string | undefined | null): SessionPayload | null {
  if (!token || !token.includes('.')) {
    return null;
  }
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) {
    return null;
  }

  const expectedSignature = sign(encoded);
  const valid =
    expectedSignature.length === signature.length &&
    timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
  if (!valid) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encoded)) as SessionPayload;
    if (!payload.email || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || process.env.PAYLOAD_ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || process.env.PAYLOAD_ADMIN_PASSWORD || 'ChangeMe123!',
  };
}

export function getAdminSessionCookieName() {
  return COOKIE_NAME;
}
