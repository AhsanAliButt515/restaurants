import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
// import Logo from "../../assets/images/logo.svg";
import Logo from '@/utils/svgs';
import { Button } from '../components/ui/Button';

export default function WelcomeScreen({ navigation }: any) {
  const handleGetStarted = async () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' as never }],
    });
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo width={155} height={35} />
        <ThemedText style={styles.subtitle}>
          Hola,{"\n"}
          Bienvenido a la prueba de Tailor hub, en ella has de añadir los restaurantes favoritos donde te gustaría ir en tu onboarding.
        </ThemedText>

        <Button
          title="Entrar"
          onPress={handleGetStarted}
          variant="outline"
          style={styles.welcomeButton}
        />
      </View>
    </ThemedView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.splash,
    flex: 1,
    borderRadius: 24,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
    fontSize: 22,
    paddingHorizontal: '10%',
  },
  welcomeButton: {
    width: '75%',
    borderRadius: 20,
  },
  buttonText: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
