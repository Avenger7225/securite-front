import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UbicacionContext } from '../context/UbicacionContext';
import MapaWebView from '../components/MapaWebView';
import { useNavigation } from '@react-navigation/native';

export default function FamilyScreen() {
  const { location } = useContext(UbicacionContext);
  
  // Estado para controlar si el menú está visible
  const [isMenuVisible] = useState(true);
  
  // Hook de navegación
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {location ? (
        <MapaWebView latitude={location.latitude} longitude={location.longitude} />
      ) : (
        <Text>Obteniendo ubicación...</Text>
      )}

      {isMenuVisible && (
        <View style={styles.menu}>
          <View style={styles.menuContent}>
            <Text style={styles.sheetText}>Menú Familia</Text>
            <TouchableOpacity style={styles.button} onPress={()=>{}}>
              <Text style={styles.buttonText}>Opcion 1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={()=>{}}>
              <Text style={styles.buttonText}>Opcion 2</Text>
            </TouchableOpacity>
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
  menu: {
    position: 'absolute',
    height: 350,
    bottom: 90,
    left: 0,
    right: 0,
    backgroundColor: '#042C6B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
    zIndex: 10,
  },
  menuContent: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 220,
    marginBottom: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black'
  },
  sheetText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'white'
  },
});
