import { DrawerButton } from '@/components/DrawerButton';
import { HeartIcon, LocationIcon, PeopleIcon } from '@/utils/svgs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import FavoritesScreen from '../screens/favorites/FavoritesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import CreateRestaurantScreen from '../screens/restaurants/CreateRestaurantScreen';
import RestaurantListScreen from '../screens/restaurants/RestaurantListScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <View style={styles.container}>
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 72,
          paddingBottom: 20,        // gap from bottom
        },
        tabBarItemStyle: {
          paddingHorizontal: 64,
          paddingVertical: 8,
        },
      }}
    >
      <Tab.Screen
        name="Restaurants"
        component={RestaurantListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <LocationIcon color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateRestaurantScreen}
        options={{
          tabBarItemStyle: { display: 'none' },
          headerShown: false,
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <HeartIcon color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <PeopleIcon color={color} />
          ),
        }}
      />
    </Tab.Navigator>
    <DrawerButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


