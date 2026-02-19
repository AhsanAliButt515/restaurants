import { ThemedView } from '@/components/themed-view';
import { Colors, Space } from '@/constants/theme';
import Logo from '@/utils/svgs';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

export default function SplashScreen({
  navigation,
  standalone,
}: {
  navigation?: any;
  standalone?: boolean;
}) {
  useEffect(() => {
    if (standalone) return;
    const t = setTimeout(() => {
      navigation?.navigate('WelcomeScreen');
    }, 2000);
    return () => clearTimeout(t);
  }, [standalone, navigation]);
  return (

    <ThemedView style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo />
      </View>
    </ThemedView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Space.md,
  },
  logoContainer: {
    backgroundColor: Colors.light.splash,
    flex: 1,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Space.xxl,
  },
});
