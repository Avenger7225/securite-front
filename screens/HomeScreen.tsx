import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UbicacionContext } from '../context/UbicacionContext';
import MapaWebView from '../components/MapaWebView';

export default function HomeScreen() {
  const { location } = useContext(UbicacionContext);

  return (
    <View style={styles.container}>
      {location ? (
        <MapaWebView latitude={location.latitude} longitude={location.longitude} />
      ) : (
        <Text>Obteniendo ubicación...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});