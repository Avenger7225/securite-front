import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { PermissionsAndroid, Platform } from 'react-native';

import { UbicacionProvider } from './context/UbicacionContext';
import { BluetoothProvider } from './context/BluetoothContext';
import AppStack from './navigation/Stack';

export default function App() {

  useEffect(() => {
    async function solicitarPermisosBluetooth() {
      if (Platform.OS === 'android' && Platform.Version >= 31) {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]);

          if (
            !['never_ask_again', 'granted'].includes(granted['android.permission.BLUETOOTH_SCAN']) ||
            !['never_ask_again', 'granted'].includes(granted['android.permission.BLUETOOTH_CONNECT'])||
            !['never_ask_again', 'granted'].includes(granted['android.permission.ACCESS_FINE_LOCATION'])
          ) {
            console.log('✅ Todos los permisos concedidos');
          } else {
            console.warn('❌ Faltan permisos de Bluetooth o ubicación');
          }
        } catch (err) {
          console.error('Error solicitando permisos:', err);
        }
      }
    }

    solicitarPermisosBluetooth();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UbicacionProvider>
        <NavigationContainer>
          <BluetoothProvider>
            <AppStack />
          </BluetoothProvider>
        </NavigationContainer>
      </UbicacionProvider>
    </GestureHandlerRootView>
  );
}
