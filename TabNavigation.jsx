import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import PlantIdentifier from './PlantIdentifier';
import Map from './Map';


const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Plant Identifier') {
              iconName = 'nature';
            } else if (route.name === 'Map') {
              iconName = 'map';
            } else if (route.name === 'Another Tab') {
              iconName = 'menu';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Plant Identifier" component={PlantIdentifier} />
        <Tab.Screen name="Map" component={Map} />
        {/* <Tab.Screen name="Another Tab" component={AnotherTab} /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default TabNavigation;
