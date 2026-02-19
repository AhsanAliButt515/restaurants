import { RootNavigator } from '@/navigation/RootNavigator';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';




const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Robert-R': require('../assets/fonts/RoobertTRIAL-Regular.otf'),
    'Robert-B': require('../assets/fonts/RoobertTRIAL-SemiBold.otf'),
  });
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={DefaultTheme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
              <RootNavigator />
              <StatusBar style="dark" />
            </SafeAreaView>
          </GestureHandlerRootView>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
