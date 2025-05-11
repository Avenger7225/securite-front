import React, { createContext, useState, useEffect, useContext } from 'react';
import * as Location from 'expo-location';

export const UbicacionContext = createContext<{ location: { latitude: number; longitude: number } | null }>({ location: null });

export const UbicacionProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permiso de ubicación denegado');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  return (
    <UbicacionContext.Provider value={{ location }}>
      {children}
    </UbicacionContext.Provider>
  );
};

export const useUbicacion = () => useContext(UbicacionContext);
