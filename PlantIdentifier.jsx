import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/components/identifier/HomeScreen';
import OneClickScreen from './src/components/identifier/OneClickScreen';
import AdvanceScreen from './src/components/identifier/AdvanceScreen';

// import PlantIdentifier from './PlantIdentifier';
// import oneClick from './src/components/identifier/OneClikScreen';

const Stack = createStackNavigator();

const PlantIdentifier = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mode Selection' }} />
        <Stack.Screen name="OneClickScreen" component={OneClickScreen} options={{ title: 'OneClickScreen' }} />
        <Stack.Screen name="AdvanceScreen" component={AdvanceScreen} options={{ title: 'AdvanceScreen' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default PlantIdentifier;
