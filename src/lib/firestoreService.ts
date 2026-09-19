// src/lib/firestoreService.ts
// BRICS Country-First Structured Persistence Layer for KhetiNexus AI

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, auth } from './firebase';
import {
  UserProfile,
  UserFarm,
  Language,
  SavedAdvisoryRecord,
  SavedSoilRecord,
  SavedDiagnosisRecord,
  FarmLocation,
} from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
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

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function normalizeCountryCode(c?: string): string {
  if (!c) return 'IN';
  const upper = c.trim().toUpperCase();
  if (upper === 'INDIA' || upper === 'IN') return 'IN';
  if (upper === 'RUSSIA' || upper === 'RU') return 'RU';
  if (upper === 'BRAZIL' || upper === 'BR') return 'BR';
  if (upper === 'CHINA' || upper === 'CN') return 'CN';
  if (upper === 'SOUTH AFRICA' || upper === 'ZA') return 'ZA';
  if (upper === 'SAUDI ARABIA' || upper === 'SA') return 'SA';
  if (upper === 'EGYPT' || upper === 'EG') return 'EG';
  if (upper === 'ETHIOPIA' || upper === 'ET') return 'ET';
  if (upper === 'INDONESIA' || upper === 'ID') return 'ID';
  if (upper === 'IRAN' || upper === 'IR') return 'IR';
  if (upper === 'UAE' || upper === 'UNITED ARAB EMIRATES' || upper === 'AE') return 'AE';
  return upper;
}

// ==========================================
// USER PROFILE MANAGEMENT
// ==========================================
export async function getUserProfile(uid: string, countryCode: string = 'IN'): Promise<UserProfile | null> {
  const normCountry = normalizeCountryCode(countryCode);
  try {
    const userRef = doc(db, 'countries', normCountry, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `countries/${normCountry}/users/${uid}`);
    return null;
  }
}

export async function createUserProfileIfMissing(
  user: User,
  preferredLanguage: Language = 'en',
  countryCode: string = 'IN'
): Promise<UserProfile> {
  const normCountry = normalizeCountryCode(countryCode);
  const path = `countries/${normCountry}/users/${user.uid}`;
  
  console.log(`[USER PROFILE INITIATING]
uid: ${user.uid}
email: ${user.email}
countryCode: ${normCountry}
path: ${path}`);

  try {
    const userRef = doc(db, 'countries', normCountry, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      console.log(`[USER PROFILE FOUND] Exists at ${path}`);
      return snap.data() as UserProfile;
    }

    console.log(`[USER PROFILE NOT FOUND] Creating new profile at ${path}`);
    const now = new Date().toISOString();
    const rawProfile: UserProfile & { countryCode: string } = {
      uid: user.uid,
      name: user.displayName || user.email?.split('@')[0] || 'Farmer',
      email: user.email || '',
      photoURL: user.photoURL || null,
      preferredLanguage: preferredLanguage,
      countryCode: normCountry,
      createdAt: now,
      updatedAt: now,
    };

    const newProfile = sanitizeFirestorePayload(rawProfile);
    console.log('[USER PROFILE PAYLOAD]', JSON.stringify(newProfile, null, 2));

    await setDoc(userRef, newProfile);
    
    // Read-back verification
    const savedSnap = await getDoc(userRef);
    if (!savedSnap.exists()) {
      throw new Error('User profile read-back failed after creation.');
    }
    console.log(`[USER PROFILE CREATED & VERIFIED SUCCESS] Path: ${path}`);
    return savedSnap.data() as UserProfile;
  } catch (error) {
    console.error(`[USER PROFILE ERROR] path: ${path}`, error);
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>,
  countryCode: string = 'IN'
): Promise<void> {
  const normCountry = normalizeCountryCode(countryCode);
  try {
    const userRef = doc(db, 'countries', normCountry, 'users', uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `countries/${normCountry}/users/${uid}`);
  }
}

// ==========================================
// FARM MANAGEMENT (countries/{countryCode}/users/{uid}/farms/{farmId})
// ==========================================
export async function getUserFarms(uid: string, countryCode: string = 'IN'): Promise<UserFarm[]> {
  const normCountry = normalizeCountryCode(countryCode);
  try {
    const farmMap = new Map<string, UserFarm>();
    const countryFarmsCol = collection(db, 'countries', normCountry, 'users', uid, 'farms');
    const cSnap = await getDocs(countryFarmsCol);
    cSnap.forEach((docSnap) => {
      const data = docSnap.data() as any;
      let locationObj: FarmLocation | undefined = undefined;
      let locAddress = data.locationName || '';

      if (data.location && typeof data.location === 'object') {
        locationObj = {
          address: data.location.address || data.locationName || '',
          village: data.location.village || '',
          mandal: data.location.mandal || '',
          district: data.location.district || data.district || '',
          state: data.location.state || data.state || data.stateRegion || '',
          country: data.location.country || data.countryCode || normCountry,
          latitude: typeof data.location.latitude === 'number' ? data.location.latitude : (typeof data.latitude === 'number' ? data.latitude : null),
          longitude: typeof data.location.longitude === 'number' ? data.location.longitude : (typeof data.longitude === 'number' ? data.longitude : null),
          accuracyMeters: data.location.accuracyMeters || data.locationMetadata?.accuracy,
          source: data.location.source || (data.locationMetadata?.source?.toUpperCase() as any) || 'GEOCODED',
          capturedAt: data.location.capturedAt || data.locationMetadata?.capturedAt || data.updatedAt || data.createdAt,
        };
        locAddress = locationObj.address || locAddress;
      } else if (typeof data.location === 'string') {
        locAddress = data.location;
      }

      const lat = typeof data.latitude === 'number' && !isNaN(data.latitude) 
        ? data.latitude 
        : (typeof locationObj?.latitude === 'number' ? locationObj.latitude : (typeof data.locationMetadata?.latitude === 'number' ? data.locationMetadata.latitude : null));
      const lon = typeof data.longitude === 'number' && !isNaN(data.longitude)
        ? data.longitude
        : (typeof locationObj?.longitude === 'number' ? locationObj.longitude : (typeof data.locationMetadata?.longitude === 'number' ? data.locationMetadata.longitude : null));

      if (!locationObj && (locAddress || lat != null)) {
        locationObj = {
          address: locAddress,
          village: data.locationMetadata?.village || '',
          mandal: data.locationMetadata?.locality || '',
          district: data.district || data.locationMetadata?.district || '',
          state: data.state || data.locationMetadata?.state || data.stateRegion || '',
          country: data.countryCode || normCountry,
          latitude: lat,
          longitude: lon,
          accuracyMeters: data.locationMetadata?.accuracy,
          source: (data.locationMetadata?.source?.toUpperCase() as any) || (lat != null ? 'GEOCODED' : 'USER_SELECTED'),
          capturedAt: data.locationMetadata?.capturedAt || data.updatedAt,
        };
      }

      farmMap.set(docSnap.id, {
        id: docSnap.id,
        farmName: data.farmName || data.name || 'My Farm',
        locationName: locAddress,
        location: locationObj,
        country: data.countryCode || normCountry,
        stateRegion: data.stateRegion || data.state || locationObj?.state || '',
        state: data.state || locationObj?.state || data.stateRegion || '',
        district: data.district || locationObj?.district || locAddress || '',
        subDistrict: data.subDistrict || locationObj?.mandal || '',
        area: data.farmSize ?? data.area ?? 0,
        areaUnit: data.farmSizeUnit ?? data.areaUnit ?? 'hectares',
        crop: data.primaryCrop || data.crop || 'Cotton',
        cropVariety: data.cropVariety || '',
        cropStage: data.cropGrowthStage || data.cropStage || 'Vegetative',
        soilType: data.soilType || 'Black Cotton Soil',
        irrigationType: data.wateringType || data.irrigationType || 'Rainfed',
        latitude: lat,
        longitude: lon,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        adoptedPillars: data.adoptedPillars,
        regenerativeFarming: data.regenerativeFarming,
        locationMetadata: data.locationMetadata,
      });
    });

    const allFarms = Array.from(farmMap.values());
    allFarms.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return allFarms;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `countries/${normCountry}/users/${uid}/farms`);
    return [];
  }
}

// Helper to sanitize Firestore payloads by converting undefined to null or omitting them
export function sanitizeFirestorePayload<T>(obj: T): T {
  if (obj === undefined) return null as unknown as T;
  if (obj === null) return null as unknown as T;
  if (Array.isArray(obj)) {
    return obj.map(v => sanitizeFirestorePayload(v)) as unknown as T;
  }
  if (typeof obj === 'object') {
    const res: Record<string, any> = {};
    for (const key of Object.keys(obj as any)) {
      const val = (obj as any)[key];
      res[key] = val === undefined ? null : sanitizeFirestorePayload(val);
    }
    return res as T;
  }
  return obj;
}

export async function createFarm(
  uid: string,
  farmData: Omit<UserFarm, 'id' | 'createdAt' | 'updatedAt'>
): Promise<UserFarm> {
  const normCountry = normalizeCountryCode(farmData.country);
  const now = new Date().toISOString();
  
  // Log exact canonical path and fields being written
  console.log(`[FARM SAVE]
uid: ${uid}
countryCode: ${normCountry}
farmId: new_farm
path: countries/${normCountry}/users/${uid}/farms/new_farm`);

  try {
    const countryFarmsCol = collection(db, 'countries', normCountry, 'users', uid, 'farms');
    
    const lat = typeof farmData.latitude === 'number' && !isNaN(farmData.latitude) ? farmData.latitude : null;
    const lon = typeof farmData.longitude === 'number' && !isNaN(farmData.longitude) ? farmData.longitude : null;

    const farmLoc: FarmLocation = farmData.location || {
      address: farmData.locationName || '',
      village: farmData.locationMetadata?.village || '',
      mandal: farmData.locationMetadata?.locality || '',
      district: farmData.district || farmData.locationMetadata?.district || '',
      state: farmData.state || farmData.locationMetadata?.state || farmData.stateRegion || '',
      country: farmData.country || normCountry,
      latitude: lat,
      longitude: lon,
      accuracyMeters: farmData.locationMetadata?.accuracy,
      source: (farmData.locationMetadata?.source?.toUpperCase() as any) || (lat != null ? 'GEOCODED' : 'USER_SELECTED'),
      capturedAt: farmData.locationMetadata?.capturedAt || now,
    };

    const rawDocumentData = {
      uid: uid,
      ownerUid: uid,
      countryCode: normCountry,
      farmId: '',
      farmName: farmData.farmName || '',
      primaryCrop: farmData.crop || '',
      cropVariety: farmData.cropVariety || '',
      cropGrowthStage: farmData.cropStage || 'Vegetative',
      soilType: farmData.soilType || '',
      wateringType: farmData.irrigationType || '',
      location: farmLoc,
      locationName: farmLoc.address || farmData.locationName || '',
      latitude: lat,
      longitude: lon,
      farmSize: farmData.area || 0,
      farmSizeUnit: farmData.areaUnit || 'hectares',
      state: farmData.state || farmLoc.state || farmData.stateRegion || '',
      stateRegion: farmData.stateRegion || farmLoc.state || '',
      district: farmData.district || farmLoc.district || '',
      subDistrict: farmData.subDistrict || farmLoc.mandal || '',
      soilMoisture: null,
      createdAt: now,
      updatedAt: now,
      locationMetadata: farmData.locationMetadata ? {
        latitude: lat,
        longitude: lon,
        accuracy: farmData.locationMetadata.accuracy || 0,
        village: farmData.locationMetadata.village || '',
        locality: farmData.locationMetadata.locality || '',
        district: farmData.locationMetadata.district || farmLoc.district || '',
        state: farmData.locationMetadata.state || farmLoc.state || '',
        country: farmData.locationMetadata.country || normCountry,
        postalCode: farmData.locationMetadata.postalCode || '',
        formattedAddress: farmData.locationMetadata.formattedAddress || farmLoc.address || '',
        source: farmData.locationMetadata.source || (lat != null ? 'gps' : 'manual'),
        capturedAt: farmData.locationMetadata.capturedAt || now,
      } : (lat != null && lon != null ? {
        latitude: lat,
        longitude: lon,
        accuracy: 0,
        village: '',
        locality: '',
        district: farmLoc.district || '',
        state: farmLoc.state || '',
        country: normCountry,
        postalCode: '',
        formattedAddress: farmLoc.address || '',
        source: 'manual',
        capturedAt: now,
      } : null),
    };

    // Sanitize to omit undefined values
    const documentData = sanitizeFirestorePayload(rawDocumentData);
    
    // Log final fields being written
    console.log('[FARM SAVE PAYLOAD]', JSON.stringify(documentData, null, 2));

    const docRef = await addDoc(countryFarmsCol, documentData);
    
    // Update the farmId inside the document for consistency
    const farmRef = doc(db, 'countries', normCountry, 'users', uid, 'farms', docRef.id);
    await updateDoc(farmRef, { farmId: docRef.id });

    // Read-back verification as requested
    const savedSnap = await getDoc(farmRef);
    if (!savedSnap.exists()) {
      throw new Error('Farm read-back failed after write.');
    }

    return {
      id: docRef.id,
      ...farmData,
      country: normCountry,
      createdAt: now,
      updatedAt: now,
    };
  } catch (error: any) {
    console.error(`[FARM SAVE ERROR]
code: ${error.code || 'unknown'}
message: ${error.message}
stack: ${error.stack}`);
    handleFirestoreError(error, OperationType.CREATE, `countries/${normCountry}/users/${uid}/farms`);
    throw error;
  }
}

export async function updateFarm(
  uid: string,
  farmId: string,
  farmData: Partial<UserFarm>
): Promise<void> {
  const normCountry = normalizeCountryCode(farmData.country || 'IN');
  const now = new Date().toISOString();

  // Log exact canonical path and fields being written
  console.log(`[FARM SAVE]
uid: ${uid}
countryCode: ${normCountry}
farmId: ${farmId}
path: countries/${normCountry}/users/${uid}/farms/${farmId}`);

  try {
    const countryFarmRef = doc(db, 'countries', normCountry, 'users', uid, 'farms', farmId);

    const rawPayload: any = {
      uid: uid,
      ownerUid: uid,
      countryCode: normCountry,
      updatedAt: now,
    };

    if (farmData.farmName !== undefined) rawPayload.farmName = farmData.farmName;
    if (farmData.crop !== undefined) rawPayload.primaryCrop = farmData.crop;
    if (farmData.cropVariety !== undefined) rawPayload.cropVariety = farmData.cropVariety;
    if (farmData.cropStage !== undefined) rawPayload.cropGrowthStage = farmData.cropStage;
    if (farmData.soilType !== undefined) rawPayload.soilType = farmData.soilType;
    if (farmData.irrigationType !== undefined) rawPayload.wateringType = farmData.irrigationType;
    if (farmData.area !== undefined) rawPayload.farmSize = farmData.area;
    if (farmData.areaUnit !== undefined) rawPayload.farmSizeUnit = farmData.areaUnit;

    const lat = farmData.latitude !== undefined 
      ? (typeof farmData.latitude === 'number' && !isNaN(farmData.latitude) ? farmData.latitude : null)
      : undefined;
    const lon = farmData.longitude !== undefined
      ? (typeof farmData.longitude === 'number' && !isNaN(farmData.longitude) ? farmData.longitude : null)
      : undefined;

    if (lat !== undefined) rawPayload.latitude = lat;
    if (lon !== undefined) rawPayload.longitude = lon;

    if (farmData.state !== undefined) rawPayload.state = farmData.state;
    if (farmData.district !== undefined) rawPayload.district = farmData.district;
    if (farmData.subDistrict !== undefined) rawPayload.subDistrict = farmData.subDistrict;
    if (farmData.stateRegion !== undefined) rawPayload.stateRegion = farmData.stateRegion;

    if (farmData.location !== undefined) {
      rawPayload.location = farmData.location;
      if (farmData.location && typeof farmData.location === 'object') {
        rawPayload.locationName = farmData.location.address;
        if (lat === undefined && typeof farmData.location.latitude === 'number') {
          rawPayload.latitude = farmData.location.latitude;
        }
        if (lon === undefined && typeof farmData.location.longitude === 'number') {
          rawPayload.longitude = farmData.location.longitude;
        }
      }
    } else if (farmData.locationName !== undefined) {
      rawPayload.locationName = farmData.locationName;
    }

    if (farmData.locationMetadata !== undefined && farmData.locationMetadata !== null) {
      rawPayload.locationMetadata = {
        latitude: farmData.locationMetadata.latitude !== undefined && farmData.locationMetadata.latitude !== null ? farmData.locationMetadata.latitude : null,
        longitude: farmData.locationMetadata.longitude !== undefined && farmData.locationMetadata.longitude !== null ? farmData.locationMetadata.longitude : null,
        accuracy: farmData.locationMetadata.accuracy || 0,
        village: farmData.locationMetadata.village || '',
        locality: farmData.locationMetadata.locality || '',
        district: farmData.locationMetadata.district || '',
        state: farmData.locationMetadata.state || '',
        country: farmData.locationMetadata.country || '',
        postalCode: farmData.locationMetadata.postalCode || '',
        formattedAddress: farmData.locationMetadata.formattedAddress || '',
        source: farmData.locationMetadata.source || 'manual',
        capturedAt: farmData.locationMetadata.capturedAt || now,
      };
    } else if (farmData.locationMetadata === null) {
      rawPayload.locationMetadata = null;
    }

    const updatePayload = sanitizeFirestorePayload(rawPayload);

    // Log final fields being written
    console.log('[FARM UPDATE PAYLOAD]', JSON.stringify(updatePayload, null, 2));

    await setDoc(countryFarmRef, updatePayload, { merge: true });

    // Read-back verification
    const savedSnap = await getDoc(countryFarmRef);
    if (!savedSnap.exists()) {
      throw new Error('Farm read-back failed after update.');
    }
  } catch (error: any) {
    console.error(`[FARM SAVE ERROR]
code: ${error.code || 'unknown'}
message: ${error.message}
stack: ${error.stack}`);
    handleFirestoreError(error, OperationType.UPDATE, `countries/${normCountry}/users/${uid}/farms/${farmId}`);
    throw error;
  }
}

export async function deleteFarm(uid: string, farmId: string, countryCode: string = 'IN'): Promise<void> {
  const normCountry = normalizeCountryCode(countryCode);
  console.log(`Starting clean recursive deletion of farm: ${farmId} under country: ${normCountry} for user: ${uid}`);

  try {
    const subcollections = ['fields', 'soilRecords', 'diagnoses', 'advisories', 'regenerative'];
    for (const subName of subcollections) {
      try {
        const colRef = collection(db, 'countries', normCountry, 'users', uid, 'farms', farmId, subName);
        const snap = await getDocs(colRef);
        const deletePromises = snap.docs.map((docSnap) =>
          deleteDoc(doc(db, 'countries', normCountry, 'users', uid, 'farms', farmId, subName, docSnap.id))
        );
        await Promise.all(deletePromises);
        console.log(`Successfully deleted ${snap.size} documents from subcollection: ${subName}`);
      } catch (subErr) {
        console.warn(`Error deleting subcollection ${subName} for farm ${farmId}:`, subErr);
      }
    }

    // Delete the parent farm document
    const countryFarmRef = doc(db, 'countries', normCountry, 'users', uid, 'farms', farmId);
    await deleteDoc(countryFarmRef);
    console.log(`Successfully deleted canonical farm document: ${farmId}`);
  } catch (error) {
    console.error('Recursive farm deletion failed:', {
      country: normCountry,
      farmId,
      uid,
      path: `countries/${normCountry}/users/${uid}/farms/${farmId}`,
    });
    handleFirestoreError(error, OperationType.DELETE, `countries/${normCountry}/users/${uid}/farms/${farmId}`);
  }
}

// ==========================================
// AI ADVISORY HISTORY (countries/{countryCode}/users/{uid}/farms/{farmId}/advisories)
// ==========================================
export async function saveAdvisoryHistory(
  uid: string,
  advisoryData: Omit<SavedAdvisoryRecord, 'id' | 'createdAt'>,
  countryCode?: string
): Promise<string> {
  if (!uid) return '';
  const finalCountry = normalizeCountryCode(countryCode || advisoryData.countryCode || 'IN');
  const farmId = advisoryData.farmId || 'default_farm';
  try {
    const colRef = collection(db, 'countries', finalCountry, 'users', uid, 'farms', farmId, 'advisories');
    const now = new Date().toISOString();
    const docRef = await addDoc(colRef, {
      ...advisoryData,
      countryCode: finalCountry,
      createdAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.warn('Could not save advisory history:', error);
    return '';
  }
}

export async function getUserAdvisories(
  uid: string,
  farmId: string,
  countryCode: string = 'IN',
  maxItems: number = 15
): Promise<SavedAdvisoryRecord[]> {
  if (!uid || !farmId) return [];
  const normCountry = normalizeCountryCode(countryCode);
  const results: SavedAdvisoryRecord[] = [];

  try {
    const colRef = collection(db, 'countries', normCountry, 'users', uid, 'farms', farmId, 'advisories');
    const snapshot = await getDocs(colRef);
    snapshot.forEach((docSnap) => {
      results.push({ id: docSnap.id, ...(docSnap.data() as Omit<SavedAdvisoryRecord, 'id'>) });
    });
  } catch (error) {
    console.warn('Warning fetching advisories from canonical path:', error);
  }

  results.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  return results.slice(0, maxItems);
}

// ==========================================
// SOIL HEALTH RECORDS (countries/{countryCode}/users/{uid}/farms/{farmId}/soilRecords)
// ==========================================
export async function saveSoilRecord(
  uid: string,
  farmId: string,
  recordData: Omit<SavedSoilRecord, 'id' | 'createdAt'>,
  countryCode: string = 'IN'
): Promise<string> {
  if (!uid || !farmId) return '';
  const normCountry = normalizeCountryCode(countryCode);
  const path = `countries/${normCountry}/users/${uid}/farms/${farmId}/soilRecords`;
  try {
    const col = collection(db, 'countries', normCountry, 'users', uid, 'farms', farmId, 'soilRecords');
    const now = new Date().toISOString();
    const docRef = await addDoc(col, {
      ...recordData,
      countryCode: normCountry,
      createdAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.warn('Could not save soil record:', error);
    try {
      handleFirestoreError(error, OperationType.CREATE, path);
    } catch {}
    return '';
  }
}

export async function getFarmSoilRecords(
  uid: string,
  farmId: string,
  countryCode: string = 'IN',
  maxItems: number = 10
): Promise<SavedSoilRecord[]> {
  if (!uid || !farmId) return [];
  const normCountry = normalizeCountryCode(countryCode);
  const results: SavedSoilRecord[] = [];

  try {
    const col = collection(db, 'countries', normCountry, 'users', uid, 'farms', farmId, 'soilRecords');
    const snapshot = await getDocs(col);
    snapshot.forEach((docSnap) => {
      results.push({ id: docSnap.id, ...(docSnap.data() as Omit<SavedSoilRecord, 'id'>) });
    });
  } catch (error) {
    console.warn('Warning fetching soil records from canonical path:', error);
  }

  results.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  return results.slice(0, maxItems);
}

// ==========================================
// CROP DIAGNOSIS RECORDS (countries/{countryCode}/users/{uid}/farms/{farmId}/diagnoses)
// ==========================================
export async function saveDiagnosisRecord(
  uid: string,
  farmId: string,
  diagData: Omit<SavedDiagnosisRecord, 'id' | 'createdAt'>,
  countryCode: string = 'IN'
): Promise<string> {
  if (!uid || !farmId) return '';
  const normCountry = normalizeCountryCode(countryCode);
  const path = `countries/${normCountry}/users/${uid}/farms/${farmId}/diagnoses`;
  try {
    const col = collection(db, 'countries', normCountry, 'users', uid, 'farms', farmId, 'diagnoses');
    const now = new Date().toISOString();
    const docRef = await addDoc(col, {
      ...diagData,
      countryCode: normCountry,
      createdAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.warn('Could not save diagnosis record:', error);
    try {
      handleFirestoreError(error, OperationType.CREATE, path);
    } catch {}
    return '';
  }
}

export async function getFarmDiagnoses(
  uid: string,
  farmId: string,
  countryCode: string = 'IN',
  maxItems: number = 10
): Promise<SavedDiagnosisRecord[]> {
  if (!uid || !farmId) return [];
  const normCountry = normalizeCountryCode(countryCode);
  const results: SavedDiagnosisRecord[] = [];

  try {
    const col = collection(db, 'countries', normCountry, 'users', uid, 'farms', farmId, 'diagnoses');
    const snapshot = await getDocs(col);
    snapshot.forEach((docSnap) => {
      results.push({ id: docSnap.id, ...(docSnap.data() as Omit<SavedDiagnosisRecord, 'id'>) });
    });
  } catch (error) {
    console.warn('Warning fetching diagnosis records from canonical path:', error);
  }

  results.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  return results.slice(0, maxItems);
}

// ==========================================
// REGENERATIVE AGRICULTURE (countries/{countryCode}/users/{uid}/farms/{farmId}/regenerative)
// ==========================================
export async function saveRegenerativePillars(
  uid: string,
  farmId: string,
  adoptedPillars: string[],
  countryCode: string = 'IN'
): Promise<void> {
  const normCountry = normalizeCountryCode(countryCode);
  const now = new Date().toISOString();

  const practices = {
    coverCrops: adoptedPillars.includes('cover-crops'),
    cropRotation: adoptedPillars.includes('crop-rotation'),
    reducedTillage: adoptedPillars.includes('reduced-tillage') || adoptedPillars.includes('minimum-tillage'),
    compost: adoptedPillars.includes('compost-organic'),
    mulching: adoptedPillars.includes('soil-mulching'),
    integratedPestManagement: adoptedPillars.includes('integrated-pest'),
    agroforestry: adoptedPillars.includes('agroforestry'),
    waterConservation: adoptedPillars.includes('water-conservation'),
    soilCover: adoptedPillars.includes('soil-cover') || adoptedPillars.includes('cover-crops') || adoptedPillars.includes('soil-mulching'),
    biodiversity: adoptedPillars.includes('biodiversity') || adoptedPillars.includes('agroforestry'),
  };

  const payload = {
    farmId,
    ownerUid: uid,
    countryCode: normCountry,
    practices,
    selectedPractices: adoptedPillars,
    adoptedPractices: adoptedPillars,
    notes: '',
    updatedAt: now,
  };

  try {
    const regenRef = doc(db, 'countries', normCountry, 'users', uid, 'farms', farmId, 'regenerative', 'current');
    await setDoc(regenRef, payload, { merge: true });

    const farmRef = doc(db, 'countries', normCountry, 'users', uid, 'farms', farmId);
    await setDoc(farmRef, {
      adoptedPillars,
      regenerativeFarming: {
        adoptedPillars,
        updatedAt: now,
      },
      updatedAt: now,
    }, { merge: true });

    console.log(`Successfully saved regenerative pillars under canonical path: countries/${normCountry}/users/${uid}/farms/${farmId}/regenerative/current`);
  } catch (error) {
    console.warn('Could not save regenerative pillars:', error);
    handleFirestoreError(error, OperationType.UPDATE, `countries/${normCountry}/users/${uid}/farms/${farmId}/regenerative/current`);
    throw error;
  }
}

export async function getRegenerativePillars(
  uid: string,
  farmId: string,
  countryCode: string = 'IN'
): Promise<string[]> {
  const normCountry = normalizeCountryCode(countryCode);
  try {
    const regenRef = doc(db, 'countries', normCountry, 'users', uid, 'farms', farmId, 'regenerative', 'current');
    const snap = await getDoc(regenRef);
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data?.selectedPractices)) {
        return data.selectedPractices;
      }
      if (Array.isArray(data?.adoptedPractices)) {
        return data.adoptedPractices;
      }
    }

    const farmRef = doc(db, 'countries', normCountry, 'users', uid, 'farms', farmId);
    const farmSnap = await getDoc(farmRef);
    if (farmSnap.exists()) {
      const data = farmSnap.data();
      if (Array.isArray(data?.adoptedPillars) && data.adoptedPillars.length > 0) {
        return data.adoptedPillars;
      }
      if (Array.isArray(data?.regenerativeFarming?.adoptedPillars) && data.regenerativeFarming.adoptedPillars.length > 0) {
        return data.regenerativeFarming.adoptedPillars;
      }
    }

    return []; // Return empty array if document does not exist — do not fabricate saved practices
  } catch (error) {
    console.warn('Could not get regenerative pillars:', error);
    return [];
  }
}
