import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FamilyScreen from '../screens/FamilyScreen';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator 
      screenOptions={{
        tabBarItemStyle: {
          width: "80%",
          height: "80%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "white",
          borderRadius: 40,
          paddingTop: 2.5,
          marginHorizontal: 20,
          marginBottom: 20,
          height: 60,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 2,
          borderColor: "white",
        },
      }}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons name="star" size={30} color={focused ? 'blue' : 'gray'} />
            ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons name="person" size={30} color={focused ? 'blue' : 'gray'} />
            ),
        }}
      />
      <Tab.Screen 
        name="Family" 
        component={FamilyScreen} 
        options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons name="people" size={30} color={focused ? 'blue' : 'gray'} />
            ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
});