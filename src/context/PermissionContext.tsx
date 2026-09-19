import React, { createContext, useContext, useState, useEffect } from 'react';

export type PermissionStatus = 'unknown' | 'granted' | 'denied';

interface PermissionContextType {
  locationPermission: PermissionStatus;
  cameraPermission: PermissionStatus;
  microphonePermission: PermissionStatus;
  accessModalOpen: boolean;
  setAccessModalOpen: (open: boolean) => void;
  permissionError: string | null;
  setPermissionError: (error: string | null) => void;
  requestMicrophonePermission: () => Promise<boolean>;
  requestCameraPermission: () => Promise<boolean>;
  requestLocationPermission: () => Promise<boolean>;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locationPermission, setLocationPermission] = useState<PermissionStatus>('unknown');
  const [cameraPermission, setCameraPermission] = useState<PermissionStatus>('unknown');
  const [microphonePermission, setMicrophonePermission] = useState<PermissionStatus>('unknown');
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Check browser permissions on mount silently (without triggering prompts)
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.permissions && navigator.permissions.query) {
      // Check microphone status
      navigator.permissions.query({ name: 'microphone' as any }).then((status) => {
        if (status.state === 'granted') setMicrophonePermission('granted');
        else if (status.state === 'denied') setMicrophonePermission('denied');

        status.onchange = () => {
          if (status.state === 'granted') setMicrophonePermission('granted');
          else if (status.state === 'denied') setMicrophonePermission('denied');
          else setMicrophonePermission('unknown');
        };
      }).catch(() => {});

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

  const requestMicrophonePermission = async (): Promise<boolean> => {
    setPermissionError(null);

    // Verify secure context
    const isSecure = typeof window !== 'undefined' && (
      window.isSecureContext ||
      window.location?.hostname === 'localhost' ||
      window.location?.hostname === '127.0.0.1'
    );

    if (!isSecure || !navigator?.mediaDevices?.getUserMedia) {
      const err = 'Microphone access requires a secure connection (HTTPS).';
      setPermissionError(err);
      setMicrophonePermission('denied');
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Permission granted: immediately release test tracks
      stream.getTracks().forEach((track) => track.stop());
      setMicrophonePermission('granted');
      setPermissionError(null);
      return true;
    } catch (err: any) {
      console.warn('[Microphone Permission Error]:', err);
      setMicrophonePermission('denied');

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError('Microphone permission was denied. Please enable microphone access in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setPermissionError('No microphone hardware was detected on your device.');
      } else {
        setPermissionError(`Microphone access failed: ${err.message || 'Unknown error'}`);
      }
      return false;
    }
  };

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
        microphonePermission,
        accessModalOpen,
        setAccessModalOpen,
        permissionError,
        setPermissionError,
        requestMicrophonePermission,
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
