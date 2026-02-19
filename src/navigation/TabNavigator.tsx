import { HeartIcon, LocationIcon, PeopleIcon } from '@/utils/svgs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import FavoritesScreen from '../screens/favorites/FavoritesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import CreateRestaurantScreen from '../screens/restaurants/CreateRestaurantScreen';
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
            <LocationIcon color={color} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Create"
        component={CreateRestaurantScreen}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' },
        }}
      /> */}
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
  );
};


