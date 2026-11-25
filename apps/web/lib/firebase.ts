import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../../firebase-applet-config.json';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore safely: fallback to standard default database if custom ID is invalid or ephemeral
function initializeDatabase() {
  try {
    if (
      firebaseConfig.firestoreDatabaseId &&
      firebaseConfig.firestoreDatabaseId !== '(default)' &&
      !firebaseConfig.firestoreDatabaseId.startsWith('ai-studio-')
    ) {
      return getFirestore(app, firebaseConfig.firestoreDatabaseId);
    }
  } catch (err) {
    console.warn('Named Firestore database unavailable, using default:', err);
  }
  return getFirestore(app);
}

export const db = initializeDatabase();
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export const BOOTSTRAP_SUPER_ADMIN_EMAIL = 'onlineguard515@gmail.com';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): void {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Notice (Local persistence active):', JSON.stringify(errInfo));
}

export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase is in offline mode; local persistence active.');
      return false;
    }
    return false;
  }
}

void testFirestoreConnection();
