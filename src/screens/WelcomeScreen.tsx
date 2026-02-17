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
          Bienvenido a la prueba de {"\n"}Tailor hub, en ella has de {"\n"} añadir los restaurantes {"\n"} favoritos donde te {"\n"} gustaría ir en tu {"\n"} onboarding.
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
    fontSize: 24,
    paddingHorizontal: '10%',
  },
  welcomeButton: {
    marginTop: 20,
    width: '85%',
    borderRadius: 20,
  },
  buttonText: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
