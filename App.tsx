import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { UbicacionProvider } from './context/UbicacionContext';
import { BluetoothProvider } from './context/BluetoothContext';
import AppStack from './navigation/Stack';

export default function App() {
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