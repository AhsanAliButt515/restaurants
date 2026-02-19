// import { IconSymbol } from '@/components/ui/icon-symbol';
// import { useNavigation } from '@react-navigation/native';
// import React from 'react';
// import { StyleSheet, TouchableOpacity } from 'react-native';

// export const DrawerButton = () => {
//   const navigation = useNavigation();

//   const goToCreateRestaurant = () => {
//     (navigation as any).navigate('AppContent', {
//       screen: 'MainTabs',
//       params: { screen: 'Create' },
//     });
//   };

//   return (
//     <TouchableOpacity
//       style={styles.button}
//       onPress={goToCreateRestaurant}
//       activeOpacity={0.7}
//     >
//       <IconSymbol name="plus" size={24} color="#FFFFFF" />
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     position: 'absolute',
//     bottom: 80,
//     right: 30,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4.65,
//     elevation: 8,
//     zIndex: 999,
//     backgroundColor: '#264BEB'
//   },
// });
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export const DrawerButton = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={[styles.button]}
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      activeOpacity={0.7}
    >
      <IconSymbol name="plus" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 80,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 999,
    backgroundColor: '#264BEB'
  },
});