import React, { createContext, useState, useEffect, useContext } from 'react';
import * as Location from 'expo-location';

export const UbicacionContext = createContext<{ location: { latitude: number; longitude: number } | null }>({ location: null });

export const UbicacionProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
  const obtenerUbicacion = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        alert('Permiso de ubicación denegado');
        console.log('Permiso no concedido');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      console.log('Ubicación obtenida:', loc);

      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
    }
  };

  obtenerUbicacion();
}, []);


  return (
    <UbicacionContext.Provider value={{ location }}>
      {children}
    </UbicacionContext.Provider>
  );
};

export const useUbicacion = () => useContext(UbicacionContext);
