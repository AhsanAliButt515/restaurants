// import { createDrawerNavigator } from '@react-navigation/drawer';
// import React from 'react';
// import { AppStack } from './AppStack';

// const Drawer = createDrawerNavigator();

// export const DrawerNavigator = () => {
//   return (
//     <Drawer.Navigator>
//       <Drawer.Screen name="AppContent" component={AppStack} options={{ title: 'Home', headerShown: false }} />
//     </Drawer.Navigator>
//   );
// };
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import CreateRestaurantScreen from '../screens/restaurants/CreateRestaurantScreen';
import { AppStack } from './AppStack';

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="AppContent" component={AppStack} options={{ title: 'Home', headerShown: false }} />
      <Drawer.Screen
        name="CreateRestaurantDrawer"
        component={CreateRestaurantScreen} // dummy, we won't use this
        options={{ drawerLabel: 'Create Restaurant' }}
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault(); // prevent default drawer behavior
            navigation.navigate('AppContent', {
              screen: 'MainTabs',
              params: { screen: 'Create' },
            });
          },
        })}
      />
    </Drawer.Navigator>
  );
};