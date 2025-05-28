import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid, Platform, Image } from 'react-native';
import { UbicacionContext } from '../context/UbicacionContext';
import MapaWebView from '../components/MapaWebView';
import { useNavigation } from '@react-navigation/native';
import { BleManager } from 'react-native-ble-plx';
import AsyncStorage from '@react-native-async-storage/async-storage';

const manager = new BleManager();
const photo = require('../assets/images.jpg');

const DispositivosScreen = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user.username);
      }
    };

    loadUser();
  }, []);

  return (
    <View style={styles.screenContent}>
      <View style={styles.UserPhotoContainer}>
        <Image source={photo} style={styles.UserPhoto} />
      </View>
      <Text style={styles.TitleText}>{username}</Text>
      <Text style={styles.SubtitleText}>Ubicación: {username}</Text>
    </View>
  );
};

// no terminado ❌
const PerdidosScreen = () => (
  <View style={styles.screenContent}>
    <Text style={styles.TitleText}>No hay ningún neartag reportado como perdido</Text>
  </View>
);

// no terminado ❌
const AgregarScreen = () => (
  <View style={styles.screenContent}>
    <Text style={styles.TitleText}>Pantalla agregar</Text>
  </View>
);

// no terminado ❌
const BluetoothScreen = () => {
  return(<View style={styles.screenContent}></View>)
}

export default function HomeScreen() {
  const { location } = useContext(UbicacionContext);
  const [activeScreen, setActiveScreen] = useState('dispositivos');
  const navigation = useNavigation();
  console.log('Ubicación actual:', location);

  return (
    <View style={styles.container}>
      {location ? (
        <MapaWebView latitude={location.latitude} longitude={location.longitude} />
      ) : (
        <Text>Obteniendo ubicación...</Text>
      )}

      <View style={styles.menu}>
        <View style={styles.segmentControl}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              activeScreen === 'dispositivos' && styles.activeSegmentButton,
            ]}
            onPress={() => setActiveScreen('dispositivos')}
          >
            <Text
              style={[
                styles.segmentText,
                activeScreen === 'dispositivos' && styles.activeSegmentText,
              ]}
            >
              DISPOSITIVOS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              activeScreen === 'perdidos' && styles.activeSegmentButton,
            ]}
            onPress={() => setActiveScreen('perdidos')}
          >
            <Text
              style={[
                styles.segmentText,
                activeScreen === 'perdidos' && styles.activeSegmentText,
              ]}
            >
              PERDIDOS
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuContent}>
          <View style={styles.menuContent}>
          {activeScreen === 'dispositivos' && <DispositivosScreen />}
          {activeScreen === 'perdidos' && <PerdidosScreen />}
          {activeScreen === 'agregar' && <AgregarScreen />}
          {activeScreen === 'dispositivos' && (
            <TouchableOpacity style={styles.addButton} onPress={() => setActiveScreen('agregar')}>
              <Text style={styles.addButtonText}>Agregar</Text>
            </TouchableOpacity>
          )}
        </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  segmentControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    marginBottom: 20,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeSegmentButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  segmentText: {
    color: 'white',
    fontWeight: 'bold',
  },
  activeSegmentText: {
    color: '#042C6B',
    fontWeight: 'bold',
  },
  menuContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 220,
    marginTop: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'black',
  },
  sheetText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  screenContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TitleText: {
    textAlign: "center",
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 29,
    marginLeft: "0%",
  },
  SubtitleText: {
    textAlign: "center",
    color: 'white',
    fontSize: 15,
    marginLeft: "20%",
  },
  UserPhotoContainer: {
    alignItems: 'center',
  },
  UserPhoto: {
    width: 120,
    height: 120,
    marginLeft: -235,
    marginBottom: -115,
    resizeMode: 'contain',
  },
});
