import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Map from './Map';

// Screens for Plant Identifier Stack
import HomeScreen from './src/components/identifier/HomeScreen';
// import OneClickScreen from './src/components/identifier/OneClickScreen';
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
    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mode Selection' }} />
    {/* <Stack.Screen name="OneClickScreen" component={OneClickScreen} options={{ title: 'One Click Identifier' }} /> */}
    <Stack.Screen name="AdvanceScreen" component={AdvanceScreen} options={{ title: 'Advanced Mode' }} />
  </Stack.Navigator>
);

// Main Tab Navigator
const TabNavigation = () => (
  <NavigationContainer>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Plant Identifier') {
            iconName = 'leaf';
          } else if (route.name === 'Map') {
            iconName = 'map';
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      {/* Include PlantIdentifier Stack as a Tab */}
      <Tab.Screen name="Plant Identifier" component={PlantIdentifierStack} />
      <Tab.Screen name="Map" component={Map} />
    </Tab.Navigator>
  </NavigationContainer>
);

export default TabNavigation;
