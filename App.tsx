import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { UbicacionProvider } from './context/UbicacionContext';
import AppStack from './navigation/Stack';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UbicacionProvider>
        <NavigationContainer>
          <AppStack />
        </NavigationContainer>
      </UbicacionProvider>
    </GestureHandlerRootView>
  );
}