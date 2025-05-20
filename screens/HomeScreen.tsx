import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UbicacionContext } from '../context/UbicacionContext';
import MapaWebView from '../components/MapaWebView';
import { useNavigation } from '@react-navigation/native';

const DispositivosScreen = () => (
  <View style={styles.screenContent}>
    <Text style={styles.infoText}>Contenido de la pantalla de Dispositivs</Text>
  </View>
);

const PerdidosScreen = () => (
  <View style={styles.screenContent}>
    <Text style={styles.infoText}>No hay ningún dispositivo reportado como perdido</Text>
  </View>
);

export default function HomeScreen() {
  const { location } = useContext(UbicacionContext);
  const [activeScreen, setActiveScreen] = useState('dispositivos');
  const navigation = useNavigation();

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
          {activeScreen === 'dispositivos' && <DispositivosScreen />}
          {activeScreen === 'perdidos' && <PerdidosScreen />}
          {activeScreen === 'dispositivos' && (
            <TouchableOpacity style={styles.addButton} onPress={() => {}}>
              <Text style={styles.addButtonText}>Agregar</Text>
            </TouchableOpacity>
          )}
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
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Fondo ligeramente transparente
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
    justifyContent: 'center', // Centra el contenido de las pantallas
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 220,
    marginTop: 20, // Espacio desde el contenido de la pantalla
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
    textAlign: 'center', // Centra el título si lo sigues usando
  },
  screenContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    color: 'white',
    fontSize: 16,
  },
});