import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Map from './src/screens/map/MapScreen';
// Screens for Plant Identifier Stack
import HomeScreen from './src/screens/identifier/HomeScreen';
import AdvanceScreen from './src/screens/identifier/AdvanceScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import EEMap from './src/screens/map/EarthEngineMap';
import MapScreen from './src/screens/map/MapScreen';
import EarthEngineMap from './src/screens/map/EarthEngineMap';

// Create Navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Plant Identifier Stack Navigator
const HomeStack = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerStyle: { backgroundColor: '#4CAF50' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="AdvanceScreen" component={AdvanceScreen} options={{ title: 'Mode Lanjut Identifikasi' }} />
  </Stack.Navigator>
);

// Main Tab Navigator
const TabNavigation = () => (
  <NavigationContainer>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Beranda') {
            iconName = 'home';
          } else if (route.name === 'Peta') {
            iconName = 'globe-asia';
          } else if (route.name === 'Koleksi') {
            iconName = "archive";
          } else if (route.name === 'Akun') {
            iconName = "user";
          }
          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Beranda" component={HomeStack} />
      <Tab.Screen name="Peta" component={MapScreen} />
      <Tab.Screen name="Koleksi" component={EarthEngineMap} />
      <Tab.Screen name="Akun" component={ProfileScreen} />
    </Tab.Navigator>
  </NavigationContainer>
);

export default TabNavigation;
