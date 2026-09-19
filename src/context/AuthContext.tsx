import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import {
  getUserProfile,
  createUserProfileIfMissing,
  getUserFarms,
  createFarm,
  updateFarm,
  deleteFarm,
  normalizeCountryCode,
} from '../lib/firestoreService';
import {
  UserProfile,
  UserFarm,
  FarmProfile,
  Language,
  userFarmToFarmProfile,
  FarmLocation,
  LocationMetadata,
} from '../types';
import { useCountry } from './CountryContext';

export const EMPTY_FARM_PROFILE: FarmProfile = {
  id: 'new-farm',
  name: '',
  country: 'India',
  stateRegion: '',
  location: '',
  farmSize: 1,
  farmUnit: 'hectares',
  crop: '',
  growthStage: 'Germination',
  soilType: '',
  irrigationType: 'Rainfed',
  latitude: null,
  longitude: null,
};

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loadingAuth: boolean;
  farms: UserFarm[];
  loadingFarms: boolean;
  activeFarm: UserFarm | null;
  activeFarmProfile: FarmProfile;
  // Auth actions
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  // Farm actions
  addFarm: (data: Omit<UserFarm, 'id' | 'createdAt' | 'updatedAt'>) => Promise<UserFarm>;
  editFarm: (farmId: string, data: Partial<UserFarm>) => Promise<void>;
  removeFarm: (farmId: string) => Promise<void>;
  selectActiveFarm: (farmId: string) => void;
  refreshFarms: () => Promise<void>;
  // Fallback demo farm setter for unauthenticated mode
  setDemoFarmProfile: (profile: FarmProfile) => void;
  // Guest Mode
  isGuestMode: boolean;
  enterGuestMode: () => void;
  exitGuestMode: () => void;
  // Modals management
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot') => void;
  farmModalOpen: boolean;
  setFarmModalOpen: (open: boolean) => void;
  editingFarm: UserFarm | null;
  setEditingFarm: (farm: UserFarm | null) => void;
  privacyModalOpen: boolean;
  setPrivacyModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  currentLanguage?: Language;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  currentLanguage = 'en',
}) => {
  const lang: Language = currentLanguage;
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Guest Mode State (explicitly opted in from Welcome Page, reset on logout/login)
  const [isGuestMode, setIsGuestMode] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('khetinexus_guest_preview') === 'true';
    } catch (e) {
      return false;
    }
  });

  const enterGuestMode = () => {
    setIsGuestMode(true);
    try {
      sessionStorage.setItem('khetinexus_guest_preview', 'true');
    } catch (e) {}
  };

  const exitGuestMode = () => {
    setIsGuestMode(false);
    try {
      sessionStorage.removeItem('khetinexus_guest_preview');
    } catch (e) {}
  };

  const [farms, setFarms] = useState<UserFarm[]>([]);
  const [loadingFarms, setLoadingFarms] = useState(false);
  const [activeFarm, setActiveFarm] = useState<UserFarm | null>(null);

  // Unauthenticated demo farm profile (static preset)
  const [demoFarmProfile, setDemoFarmProfile] = useState<FarmProfile>(() => {
    return EMPTY_FARM_PROFILE;
  });

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [farmModalOpen, setFarmModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<UserFarm | null>(null);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const { activeCountry } = useCountry();
  const initializedRef = useRef<string | null>(null);

  // Auto-resolve coordinates for active farm with geographic text but missing lat/lng
  const resolveAndPersistCoordinates = async (uid: string, farm: UserFarm, countryCode: string) => {
    try {
      const locQuery = [
        farm.locationName || farm.district,
        farm.district && farm.district !== farm.locationName ? farm.district : null,
        farm.stateRegion || farm.state,
        countryCode || farm.country || 'India',
      ]
        .filter(Boolean)
        .join(', ');

      if (!locQuery.trim()) return;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locQuery)}&limit=1`
      );
      if (!res.ok) return;
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const lat = parseFloat(parseFloat(data[0].lat).toFixed(6));
        const lon = parseFloat(parseFloat(data[0].lon).toFixed(6));
        if (
          typeof lat === 'number' &&
          typeof lon === 'number' &&
          !isNaN(lat) &&
          !isNaN(lon) &&
          lat >= -90 &&
          lat <= 90 &&
          lon >= -180 &&
          lon <= 180
        ) {
          const farmLoc: FarmLocation = farm.location || {
            address: farm.locationName || '',
            village: farm.locationMetadata?.village || '',
            mandal: farm.locationMetadata?.locality || '',
            district: farm.district || farm.locationName || '',
            state: farm.state || farm.stateRegion || '',
            country: farm.country || countryCode || 'IN',
            latitude: lat,
            longitude: lon,
            accuracyMeters: 500,
            source: 'GEOCODED',
            capturedAt: new Date().toISOString(),
          };
          farmLoc.latitude = lat;
          farmLoc.longitude = lon;

          const updatedMetadata: LocationMetadata = {
            latitude: lat,
            longitude: lon,
            accuracy: 500,
            village: farm.locationMetadata?.village || '',
            locality: farm.locationMetadata?.locality || '',
            district: farm.district || farm.locationName || '',
            state: farm.stateRegion || farm.state || '',
            country: farm.country || countryCode || '',
            postalCode: farm.locationMetadata?.postalCode || '',
            formattedAddress: data[0].display_name || farm.locationName,
            source: 'geocoded',
            capturedAt: new Date().toISOString(),
          };

          const patch: Partial<UserFarm> = {
            latitude: lat,
            longitude: lon,
            location: farmLoc,
            locationMetadata: updatedMetadata,
            updatedAt: new Date().toISOString(),
          };

          await updateFarm(uid, farm.id, patch);
          setFarms((prev) => prev.map((f) => (f.id === farm.id ? { ...f, ...patch } : f)));
          setActiveFarm((prev) => (prev && prev.id === farm.id ? { ...prev, ...patch } : prev));
        }
      }
    } catch (err) {
      console.warn('[AUTH SYSTEM] Automatic geocoding resolution for active farm failed:', err);
    }
  };

  // Load user farms from Firestore
  const loadUserFarms = async (uid: string, countryCode: string) => {
    setLoadingFarms(true);
    try {
      const userFarms = await getUserFarms(uid, countryCode);
      setFarms(userFarms);

      if (userFarms.length > 0) {
        // Restore last selected farm from localStorage or default to first
        const savedFarmId = localStorage.getItem(`khetinexus_active_farm_${uid}_${countryCode}`);
        const found = userFarms.find((f) => f.id === savedFarmId);
        const currentActive = found || userFarms[0];
        setActiveFarm(currentActive);

        // If the active farm is missing coordinates but has geographic text, attempt real geocoding resolution and persist canonical coordinates
        const hasCoords =
          typeof currentActive.latitude === 'number' &&
          typeof currentActive.longitude === 'number' &&
          !isNaN(currentActive.latitude) &&
          !isNaN(currentActive.longitude);
        if (!hasCoords && (currentActive.locationName || currentActive.stateRegion || currentActive.district)) {
          resolveAndPersistCoordinates(uid, currentActive, countryCode);
        }
      } else {
        setActiveFarm(null);
      }
    } catch (error) {
      console.error('Error loading farms:', error);
    } finally {
      setLoadingFarms(false);
    }
  };

  // Listen to Firebase Auth state (registers exactly once on mount)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(`[AUTH STATE CHANGE] User ID: ${currentUser?.uid || 'none'}`);
      setUser(currentUser);
      if (!currentUser) {
        setUserProfile(null);
        setFarms([]);
        setActiveFarm(null);
        initializedRef.current = null;
        setLoadingAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Cohesive, sequential user initialization effect
  // Sequence: Auth state -> UID -> resolve Active Country -> create/read User document -> load Farms -> ready
  useEffect(() => {
    let active = true;

    const initializeUserSession = async () => {
      if (!user) {
        return;
      }

      const normCountry = normalizeCountryCode(activeCountry);
      const initKey = `${user.uid}_${normCountry}`;

      if (initializedRef.current === initKey) {
        console.log(`[AUTH SYSTEM] Session already initialized for key: ${initKey}`);
        setLoadingAuth(false);
        return;
      }

      setLoadingAuth(true);
      exitGuestMode();

      try {
        console.log(`[AUTH SYSTEM] Initializing user session for key: ${initKey}`);
        
        // 1. Create or read canonical User document at countries/{countryCode}/users/{uid}
        const profile = await createUserProfileIfMissing(user, lang, normCountry);
        
        if (active) {
          setUserProfile(profile);
          console.log(`[AUTH SYSTEM] User profile loaded. Loading farms...`);
          
          // 2. Load farms under this country namespace
          await loadUserFarms(user.uid, normCountry);
          
          initializedRef.current = initKey;
          console.log(`[AUTH SYSTEM] Session fully initialized successfully for key: ${initKey}`);
        }
      } catch (error) {
        console.error(`[AUTH SYSTEM ERROR] Session initialization failed for key: ${initKey}:`, error);
      } finally {
        if (active) {
          setLoadingAuth(false);
        }
      }
    };

    initializeUserSession();

    return () => {
      active = false;
    };
  }, [user, activeCountry, lang]);

  const refreshFarms = async () => {
    if (user) {
      const normCountry = normalizeCountryCode(activeCountry);
      await loadUserFarms(user.uid, normCountry);
    }
  };

  const selectActiveFarm = (farmId: string) => {
    const normCountry = normalizeCountryCode(activeCountry);
    const selected = farms.find((f) => f.id === farmId);
    if (selected) {
      setActiveFarm(selected);
      if (user) {
        localStorage.setItem(`khetinexus_active_farm_${user.uid}_${normCountry}`, farmId);
        const hasCoords =
          typeof selected.latitude === 'number' &&
          typeof selected.longitude === 'number' &&
          !isNaN(selected.latitude) &&
          !isNaN(selected.longitude);
        if (!hasCoords && (selected.locationName || selected.stateRegion || selected.district)) {
          resolveAndPersistCoordinates(user.uid, selected, normCountry);
        }
      }
    }
  };

  // Auth Operations
  const signInWithEmail = async (email: string, pass: string) => {
    setLoadingAuth(true);
    exitGuestMode();
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    setUser(cred.user);
    setAuthModalOpen(false);
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setLoadingAuth(true);
    exitGuestMode();
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (name.trim()) {
      await updateProfile(cred.user, { displayName: name.trim() });
    }
    setUser(cred.user);
    setAuthModalOpen(false);
  };

  const signInWithGoogle = async () => {
    try {
      setLoadingAuth(true);
      exitGuestMode();
      const cred = await signInWithPopup(auth, googleProvider);
      setUser(cred.user);
      setAuthModalOpen(false);
    } catch (error: any) {
      setLoadingAuth(false);
      if (error.code === 'auth/popup-closed-by-user') {
        return;
      }
      throw error;
    }
  };

  const logout = async () => {
    setLoadingAuth(true);
    await fbSignOut(auth);
    initializedRef.current = null;
    setUser(null);
    setUserProfile(null);
    setFarms([]);
    setActiveFarm(null);
    exitGuestMode();
    // Clean up temporary UI session and navigation keys from localStorage without touching user data
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.includes('lastFeature') || k.includes('activeTab') || k.includes('selectedView'))) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {}
    setLoadingAuth(false);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Farm Operations
  const addFarm = async (data: Omit<UserFarm, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserFarm> => {
    const authUser = auth.currentUser;
    if (!authUser || !authUser.uid) {
      throw new Error("Please sign in before saving your farm.");
    }
    if (!activeCountry) {
      throw new Error("Please select your country before creating a farm.");
    }

    const normCountry = normalizeCountryCode(activeCountry);
    
    // Ensure user profile document exists first
    await createUserProfileIfMissing(authUser, lang, activeCountry);

    // Enforce country boundary
    const farmData = { ...data, country: normCountry };
    const newFarm = await createFarm(authUser.uid, farmData);
    const updated = [newFarm, ...farms];
    setFarms(updated);
    setActiveFarm(newFarm);
    localStorage.setItem(`khetinexus_active_farm_${authUser.uid}_${activeCountry}`, newFarm.id);
    return newFarm;
  };

  const editFarm = async (farmId: string, data: Partial<UserFarm>) => {
    const authUser = auth.currentUser;
    if (!authUser || !authUser.uid) {
      throw new Error("Please sign in before saving your farm.");
    }
    if (!activeCountry) {
      throw new Error("Please select your country before creating a farm.");
    }

    const normCountry = normalizeCountryCode(activeCountry);

    // Ensure user profile document exists first
    await createUserProfileIfMissing(authUser, lang, activeCountry);

    // Enforce country boundary
    const farmData = { ...data, country: normCountry };
    await updateFarm(authUser.uid, farmId, farmData);
    const updated = farms.map((f) => (f.id === farmId ? { ...f, ...farmData, country: normCountry, updatedAt: new Date().toISOString() } : f));
    setFarms(updated);
    if (activeFarm?.id === farmId) {
      setActiveFarm((prev) => (prev ? { ...prev, ...farmData, country: normCountry, updatedAt: new Date().toISOString() } : null));
    }
  };

  const removeFarm = async (farmId: string) => {
    if (!user) throw new Error('User not authenticated');
    await deleteFarm(user.uid, farmId, activeCountry);
    const updated = farms.filter((f) => f.id !== farmId);
    setFarms(updated);
    if (activeFarm?.id === farmId) {
      const nextFarm = updated[0] || null;
      setActiveFarm(nextFarm);
      if (nextFarm) {
        localStorage.setItem(`khetinexus_active_farm_${user.uid}_${activeCountry}`, nextFarm.id);
      } else {
        localStorage.removeItem(`khetinexus_active_farm_${user.uid}_${activeCountry}`);
      }
    }
  };

  // Compute active FarmProfile: if user is authenticated and has active farm, convert it. Otherwise return demoFarmProfile.
  const activeFarmProfile: FarmProfile = user
    ? activeFarm
      ? userFarmToFarmProfile(activeFarm)
      : { ...EMPTY_FARM_PROFILE, country: activeCountry, stateRegion: '', location: '' }
    : demoFarmProfile;

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loadingAuth,
        farms,
        loadingFarms,
        activeFarm,
        activeFarmProfile,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        logout,
        resetPassword,
        addFarm,
        editFarm,
        removeFarm,
        selectActiveFarm,
        refreshFarms,
        setDemoFarmProfile,
        isGuestMode,
        enterGuestMode,
        exitGuestMode,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        farmModalOpen,
        setFarmModalOpen,
        editingFarm,
        setEditingFarm,
        privacyModalOpen,
        setPrivacyModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
