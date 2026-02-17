import { HeartIcon, LocationIcon, PeopleIcon } from '@/utils/svgs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import FavoritesScreen from '../screens/favorites/FavoritesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import RestaurantListScreen from '../screens/restaurants/RestaurantListScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="Restaurants"
        component={RestaurantListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <LocationIcon width={size} height={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <HeartIcon width={size} height={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <PeopleIcon width={size} height={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
