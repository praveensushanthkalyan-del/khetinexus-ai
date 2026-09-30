import { SoilReport } from '../types';

export interface CachedSoilAdvisory {
  cacheKey: string; // `${userId}_${farmId}`
  userId: string;
  farmId: string;
  farmName?: string;
  crop?: string;
  location?: string;
  state?: string;
  district?: string;
  soilType?: string;
  soilReport: SoilReport;
  analysisData?: {
    summary?: string;
    deficiencies?: string[];
    regenerativeRecommendations?: string[];
    organicMatterSuggestions?: string[];
    cropSpecificAdvice?: string;
    source?: string;
  };
  syncedAt: number; // UTC timestamp ms
  lastSyncFormatted: string;
}

const DB_NAME = 'khetinexus_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'soil_advisories';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB is not supported in this environment.'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'cacheKey' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB.'));
    };
  });
}

/**
 * Persist successfully fetched soil advisory and measurements to offline IndexedDB
 */
export async function saveCachedSoilAdvisory(
  userId: string = 'guest',
  farmId: string = 'default_farm',
  data: {
    farmName?: string;
    crop?: string;
    location?: string;
    state?: string;
    district?: string;
    soilType?: string;
    soilReport: SoilReport;
    analysisData?: {
      summary?: string;
      deficiencies?: string[];
      regenerativeRecommendations?: string[];
      organicMatterSuggestions?: string[];
      cropSpecificAdvice?: string;
      source?: string;
    };
  }
): Promise<void> {
  try {
    const db = await openDatabase();
    const cacheKey = `${userId || 'guest'}_${farmId || 'default'}`;
    const now = Date.now();
    const formatted = new Date(now).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const record: CachedSoilAdvisory = {
      cacheKey,
      userId: userId || 'guest',
      farmId: farmId || 'default',
      farmName: data.farmName,
      crop: data.crop,
      location: data.location,
      state: data.state,
      district: data.district,
      soilType: data.soilType,
      soilReport: data.soilReport,
      analysisData: data.analysisData,
      syncedAt: now,
      lastSyncFormatted: formatted,
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const putRequest = store.put(record);

      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
    });
  } catch (err) {
    console.warn('[SoilOfflineCache] Failed to save soil advisory to IndexedDB:', err);
  }
}

/**
 * Retrieve the latest cached soil advisory for a specific user and farm
 */
export async function getCachedSoilAdvisory(
  userId: string = 'guest',
  farmId: string = 'default_farm'
): Promise<CachedSoilAdvisory | null> {
  try {
    const db = await openDatabase();
    const cacheKey = `${userId || 'guest'}_${farmId || 'default'}`;

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getRequest = store.get(cacheKey);

      getRequest.onsuccess = () => {
        resolve(getRequest.result || null);
      };

      getRequest.onerror = () => {
        resolve(null);
      };
    });
  } catch (err) {
    console.warn('[SoilOfflineCache] Failed to read from IndexedDB:', err);
    return null;
  }
}

/**
 * Clean user-specific offline records on logout
 */
export async function clearUserSoilCache(userId: string): Promise<void> {
  if (!userId || userId === 'guest') return;
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const cursorReq = store.openCursor();

      cursorReq.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          if (cursor.value.userId === userId) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };

      cursorReq.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('[SoilOfflineCache] Failed to clear user cache:', err);
  }
}
