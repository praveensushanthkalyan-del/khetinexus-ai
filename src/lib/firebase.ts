import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, getFirestore, doc, getDocFromServer } from 'firebase/firestore';
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

// Initialize Firestore with forced long polling for robust transport in iframe and proxy environments
export const db = (() => {
  try {
    const dbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? firebaseConfig.firestoreDatabaseId
      : undefined;
    return initializeFirestore(app, {
      experimentalForceLongPolling: true,
    }, dbId);
  } catch {
    return firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
  }
})();

// Connection test helper according to guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline warning: Please check your network or Firebase configuration.');
    }
  }
}

if (typeof window !== 'undefined') {
  testConnection();
}

export default app;
