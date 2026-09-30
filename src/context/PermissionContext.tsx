import React, { createContext, useContext, useState, useEffect } from 'react';

export type PermissionStatus = 'unknown' | 'granted' | 'denied';

interface PermissionContextType {
  locationPermission: PermissionStatus;
  cameraPermission: PermissionStatus;
  accessModalOpen: boolean;
  setAccessModalOpen: (open: boolean) => void;
  permissionError: string | null;
  setPermissionError: (error: string | null) => void;
  requestCameraPermission: () => Promise<boolean>;
  requestLocationPermission: () => Promise<boolean>;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locationPermission, setLocationPermission] = useState<PermissionStatus>('unknown');
  const [cameraPermission, setCameraPermission] = useState<PermissionStatus>('unknown');
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Check browser permissions on mount silently (without triggering prompts)
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.permissions && navigator.permissions.query) {
      // Check camera status
      navigator.permissions.query({ name: 'camera' as any }).then((status) => {
        if (status.state === 'granted') setCameraPermission('granted');
        else if (status.state === 'denied') setCameraPermission('denied');

        status.onchange = () => {
          if (status.state === 'granted') setCameraPermission('granted');
          else if (status.state === 'denied') setCameraPermission('denied');
          else setCameraPermission('unknown');
        };
      }).catch(() => {});

      // Check geolocation status
      navigator.permissions.query({ name: 'geolocation' as any }).then((status) => {
        if (status.state === 'granted') setLocationPermission('granted');
        else if (status.state === 'denied') setLocationPermission('denied');

        status.onchange = () => {
          if (status.state === 'granted') setLocationPermission('granted');
          else if (status.state === 'denied') setLocationPermission('denied');
          else setLocationPermission('unknown');
        };
      }).catch(() => {});
    }
  }, []);

  const requestCameraPermission = async (): Promise<boolean> => {
    setPermissionError(null);

    const isSecure = typeof window !== 'undefined' && (
      window.isSecureContext ||
      window.location?.hostname === 'localhost' ||
      window.location?.hostname === '127.0.0.1'
    );

    if (!isSecure || !navigator?.mediaDevices?.getUserMedia) {
      const err = 'Camera access requires a secure connection (HTTPS).';
      setPermissionError(err);
      setCameraPermission('denied');
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      setCameraPermission('granted');
      setPermissionError(null);
      return true;
    } catch (err: any) {
      console.warn('[Camera Permission Error]:', err);
      setCameraPermission('denied');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError('Camera permission was denied. Please enable camera access in your browser settings.');
      } else {
        setPermissionError(`Camera access failed: ${err.message || 'Unknown error'}`);
      }
      return false;
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    setPermissionError(null);

    if (!navigator?.geolocation) {
      setPermissionError('Geolocation is not supported by your browser.');
      setLocationPermission('denied');
      return false;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationPermission('granted');
          setPermissionError(null);
          resolve(true);
        },
        (err) => {
          setLocationPermission('denied');
          if (err.code === err.PERMISSION_DENIED) {
            setPermissionError('Location permission was denied. Please enable location access in browser settings.');
          } else {
            setPermissionError(`Location request failed: ${err.message}`);
          }
          resolve(false);
        },
        { timeout: 10000 }
      );
    });
  };

  return (
    <PermissionContext.Provider
      value={{
        locationPermission,
        cameraPermission,
        accessModalOpen,
        setAccessModalOpen,
        permissionError,
        setPermissionError,
        requestCameraPermission,
        requestLocationPermission,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};
