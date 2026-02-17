import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuthContext } from "@/navigation/RootNavigator";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Button } from "../../components/ui/Button";

export default function ProfileScreen() {
  const { logout } = useAuthContext();
  const [image, setImage] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [dni, setDni] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nacimiento, setNacimiento] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState<Date | null>(null);

  // 📅 Format date DD/MM/YYYY
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onChangeDate = (_: any, selectedDate?: Date) => {
    if (Platform.OS !== "ios") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setDate(selectedDate);
      setNacimiento(formatDate(selectedDate));
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission required", "We need access to your gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Avatar */}
      <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatar} />
        ) : (
          <ThemedText>Upload</ThemedText>
        )}
      </TouchableOpacity>

      <ThemedText type="subtitle" style={{ marginTop: 20 }}>
        Nombre de usuario
      </ThemedText>

      <View style={styles.inputContainer}>
        {/* DNI */}
        <ThemedText type="subtitle" style={styles.label}>
          DNI
        </ThemedText>
        <TextInput
          style={styles.input}
          placeholder="03967380Q"
          placeholderTextColor="#000"
          value={dni}
          onChangeText={setDni}
        />

        {/* Fecha de nacimiento */}
        <ThemedText type="subtitle" style={styles.label}>
          Fecha de Nacimiento
        </ThemedText>

        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <View pointerEvents="none">
            <TextInput
              style={styles.input}
              placeholder="12/12/1990"
              placeholderTextColor="#000"
              value={nacimiento}
              editable={false}
            />
          </View>
        </TouchableOpacity>

        {/* Dirección */}
        <ThemedText type="subtitle" style={styles.label}>
          Dirección
        </ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Calle de las Eras, 92"
          placeholderTextColor="#000"
          value={direccion}
          onChangeText={setDireccion}
        />

        <Button
          title="Logout"
          onPress={logout}
          variant="secondary"
          style={styles.logoutButton}
          textStyle={{ color: '#fff' }}
        />
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeDate}
          maximumDate={new Date()}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  avatarContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  input: {
    width: "100%",
    height: 45,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 2,
  },
  label: {
    color: "#000",
    fontSize: 16,
    marginBottom: 4,
    marginTop: 10,
  },
  inputContainer: {
    width: "100%",
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#ff4444',
  },
});
