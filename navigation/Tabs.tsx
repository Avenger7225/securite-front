import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapView, { Marker } from 'react-native-maps';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FamilyScreen from '../screens/FamilyScreen';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
      />
      <Tab.Screen 
        name="Family" 
        component={FamilyScreen} 
      />
    </Tab.Navigator>
  );
}
