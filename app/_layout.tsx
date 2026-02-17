import { useColorScheme } from '@/hooks/use-color-scheme';
import { RootNavigator } from '@/navigation/RootNavigator';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  console.log('[RootLayout] Rendering with scheme:', colorScheme);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
            <RootNavigator />
            <StatusBar style="auto" />
          </SafeAreaView>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
