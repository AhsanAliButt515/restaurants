import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import CreateRestaurantScreen from '../screens/restaurants/CreateRestaurantScreen';
import { AppStack } from './AppStack';

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="AppContent" component={AppStack} options={{ title: 'Home', headerShown: false }} />
      <Drawer.Screen name="Create Restaurant" component={CreateRestaurantScreen} />
    </Drawer.Navigator>
  );
};
