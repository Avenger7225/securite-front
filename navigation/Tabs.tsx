import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from 'react-native-vector-icons';
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
        options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons name="star" size={30} color={focused ? 'blue' : 'gray'} />
            ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons name="person" size={30} color={focused ? 'blue' : 'gray'} />
            ),
        }}
      />
      <Tab.Screen 
        name="Family" 
        component={FamilyScreen} 
        options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons name="group" size={30} color={focused ? 'blue' : 'gray'} />
            ),
        }}
      />
    </Tab.Navigator>
  );
}
