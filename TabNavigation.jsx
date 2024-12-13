import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Map from './Map';

// Screens for Plant Identifier Stack
import HomeScreen from './src/components/identifier/HomeScreen';
import AdvanceScreen from './src/components/identifier/AdvanceScreen';

// Create Navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Plant Identifier Stack Navigator
const PlantIdentifierStack = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerStyle: { backgroundColor: '#4CAF50' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mode Identifikasi' }} />
    <Stack.Screen name="AdvanceScreen" component={AdvanceScreen} options={{ title: 'Mode Lanjut' }} />
  </Stack.Navigator>
);

// Main Tab Navigator
const TabNavigation = () => (
  <NavigationContainer>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Identifikasi') {
            iconName = 'leaf';
          } else if (route.name === 'Peta') {
            iconName = 'globe-asia';
          } else if (route.name === 'Koleksi') {
            iconName = "archive";
          } else if (route.name === 'Akun') {
            iconName = "user";
          }
          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Identifikasi" component={PlantIdentifierStack} />
      <Tab.Screen name="Peta" component={Map} />
      <Tab.Screen name="Koleksi" component={Map} />
      <Tab.Screen name="Akun" component={Map} />
    </Tab.Navigator>
  </NavigationContainer>
);

export default TabNavigation;
