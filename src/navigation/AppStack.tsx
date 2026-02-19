import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DrawerButton } from '../components/DrawerButton';
import EditRestaurantScreen from '../screens/restaurants/EditRestaurantScreen';
import RestaurantDetailScreen from '../screens/restaurants/RestaurantDetailScreen';
import { TabNavigator } from './TabNavigator';

const Stack = createNativeStackNavigator();

export const AppStack = () => {
  return (
    <View style={styles.container}>
      <Stack.Navigator initialRouteName="MainTabs" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} options={{ title: 'Restaurant Details' }} />
        <Stack.Screen name="EditRestaurant" component={EditRestaurantScreen} options={{ title: 'Actualizar restaurante' }} />
      </Stack.Navigator>
      <DrawerButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});