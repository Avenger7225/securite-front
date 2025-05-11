import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UbicacionContext } from '../context/UbicacionContext';
import MapaWebView from '../components/MapaWebView';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const { location } = useContext(UbicacionContext);
  
  // Estado para controlar si el menú está visible
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  
  // Hook de navegación
  const navigation = useNavigation();

  // Función para alternar la visibilidad del menú
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  // Cerrar el menú cuando se cambie de pantalla
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setIsMenuVisible(false);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {location ? (
        <MapaWebView latitude={location.latitude} longitude={location.longitude} />
      ) : (
        <Text>Obteniendo ubicación...</Text>
      )}

      <TouchableOpacity onPress={toggleMenu} style={styles.openButton}>
        <Text style={styles.openButtonText}>Abrir Menú Familiar</Text>
      </TouchableOpacity>

      {isMenuVisible && (
        <View style={styles.menu}>
          <View style={styles.menuContent}>
            <Text style={styles.sheetText}>Menú Deslizante</Text>
            <Text style={styles.sheetText}>Opción 1</Text>
            <Text style={styles.sheetText}>Opción 2</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  openButton: {
    position: 'absolute',
    marginLeft: -50,
    bottom: 100,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  openButtonText: {
    color: 'white',
    fontSize: 18,
  },
  menu: {
    position: 'absolute',
    bottom: 180,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
    zIndex: 10,
  },
  menuContent: {
    alignItems: 'center',
  },
  sheetText: {
    fontSize: 18,
    marginBottom: 20,
  },
});
