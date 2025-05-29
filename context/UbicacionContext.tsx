import React, { createContext, useState, useEffect, useContext } from 'react';
import * as Location from 'expo-location';

export const UbicacionContext = createContext<{
  location: { latitude: number; longitude: number } | null;
  setLocation: React.Dispatch<React.SetStateAction<{ latitude: number; longitude: number } | null>>;
}>({
  location: null,
  setLocation: () => {}
});

export const UbicacionProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    const obtenerUbicacion = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permiso de ubicación denegado');
          return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      } catch (error) {
        console.error('Error al obtener ubicación:', error);
      }
    };
    obtenerUbicacion();
  }, []);

  return (
    <UbicacionContext.Provider value={{ location, setLocation }}>
      {children}
    </UbicacionContext.Provider>
  );
};

export const useUbicacion = () => useContext(UbicacionContext);
