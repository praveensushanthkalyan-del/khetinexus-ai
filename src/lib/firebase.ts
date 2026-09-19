import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import baseConfig from '../../firebase-applet-config.json';

// Use configuration from firebase-applet-config with optional environment override
const customApiKey = (typeof import.meta !== 'undefined' && (import.meta as Record<string, any>).env?.VITE_FIREBASE_API_KEY) || baseConfig.apiKey;
export const firebaseConfig = {
  ...baseConfig,
  apiKey: customApiKey,
};

// Initialize Firebase client safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with auto-detect long polling fallback for iframe and restricted proxy environments
export const db = (() => {
  try {
    const dbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? firebaseConfig.firestoreDatabaseId
      : undefined;
    return initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
    }, dbId);
  } catch {
    return firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
  }
})();

export default app;
