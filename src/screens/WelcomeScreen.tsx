import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, CornorRadius, Space } from '@/constants/theme';
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
    padding: Space.md,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.grey,
    flex: 1,
    borderRadius: Space.lg,
    padding: '10%',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 28,
    fontSize: 24,
    fontFamily: 'Robert-R',
    color: Colors.light.black,
  },
  welcomeButton: {
    marginTop: 24,
    width: '100%',
    borderRadius: CornorRadius.CornorRadius,
  },
  buttonText: {
    color: Colors.light.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
