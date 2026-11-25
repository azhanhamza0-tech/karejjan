import fs from 'node:fs';
import path from 'node:path';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const FIREBASE_JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
);

let cachedProjectId: string | null = null;

export function getFirebaseProjectId(): string {
  if (cachedProjectId) return cachedProjectId;
  if (process.env.FIREBASE_PROJECT_ID) {
    cachedProjectId = process.env.FIREBASE_PROJECT_ID;
    return cachedProjectId;
  }
  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const raw = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (raw.projectId) {
      cachedProjectId = raw.projectId;
      return cachedProjectId!;
    }
  }
  cachedProjectId = 'commanding-obelisk-5vc14';
  return cachedProjectId;
}

export const BOOTSTRAP_SUPER_ADMIN_EMAIL = (
  process.env.BOOTSTRAP_SUPER_ADMIN_EMAIL || 'onlineguard515@gmail.com'
).toLowerCase();

export interface VerifiedUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  name?: string;
}

export async function verifyFirebaseIdToken(authHeader?: string): Promise<VerifiedUser> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('MISSING_AUTH_TOKEN');
  }
  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) {
    throw new Error('MISSING_AUTH_TOKEN');
  }

  const projectId = getFirebaseProjectId();
  const { payload } = await jwtVerify(token, FIREBASE_JWKS, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  });

  const uid = typeof payload.sub === 'string' ? payload.sub : '';
  const email = typeof payload.email === 'string' ? payload.email : '';
  const emailVerified = payload.email_verified === true;
  const name = typeof payload.name === 'string' ? payload.name : undefined;

  if (!uid) {
    throw new Error('INVALID_AUTH_TOKEN');
  }

  return { uid, email, emailVerified, name };
}
