import {
  uploadRestaurantImage,
  useRestaurantDetailQuery,
  useUpdateRestaurantMutation,
} from '@/api/restaurants';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/Button';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  LogBox,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MIN_DESCRIPTION_LENGTH = 10;
const URL_REGEX = /^https?:\/\/.+\..+/i;

function isValidUrl(str: string): boolean {
  return URL_REGEX.test(str.trim());
}

function getBackendErrorMessage(error: unknown): string {
  const err = error as { response?: { data?: { message?: string } }; message?: string };
  const data = err?.response?.data;
  if (data && typeof data === 'object' && data.message) return String(data.message);
  return err?.message ?? 'No se pudo actualizar el restaurante';
}

type FieldErrors = {
  name?: string;
  address?: string;
  description?: string;
  image?: string;
  location?: string;
};

export default function EditRestaurantScreen() {
  const route = useRoute();
  const id = (route.params as { id?: string })?.id ?? '';
  console.log('id', id);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const placesRef = useRef<any>(null);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState('');

  const { data: restaurant, isLoading: isLoadingRestaurant } = useRestaurantDetailQuery(id);
  const updateMutation = useUpdateRestaurantMutation(id); // this id is sent in the URL: PUT /restaurant/:id

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Actualizar restaurante' });
  }, [navigation]);

  useEffect(() => {
    LogBox.ignoreLogs([
      'VirtualizedLists should never be nested',
      'VirtualizedLists should never be nested inside plain ScrollViews',
    ]);
  }, []);

  useEffect(() => {
    if (!restaurant) return;
    setName(restaurant.name);
    setAddress(restaurant.address ?? '');
    setDescription(restaurant.description ?? '');
    setImageUrl(restaurant.image ?? '');
    if (restaurant.latlng) {
      setLat(String(restaurant.latlng.lat));
      setLng(String(restaurant.latlng.lng));
    }
  }, [restaurant]);

  useEffect(() => {
    if (restaurant?.address && placesRef.current?.setAddressText) {
      placesRef.current.setAddressText(restaurant.address);
    }
  }, [restaurant?.address]);

  const clearFieldError = (field: keyof FieldErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permiso necesario', 'Necesitamos acceso a tu galería para subir la imagen.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      setImageUrl('');
      clearFieldError('image');
      setUploadingImage(true);
      try {
        const url = await uploadRestaurantImage(uri);
        setImageUrl(url);
        setImage(null);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Error al subir la imagen';
        Alert.alert('Error de subida', msg);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const getImageValue = (): string => {
    if (imageUrl.trim()) return imageUrl.trim();
    if (image) return image;
    return '';
  };

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};
    if (!name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    } else if (description.trim().length < MIN_DESCRIPTION_LENGTH) {
      newErrors.description = `La descripción debe tener al menos ${MIN_DESCRIPTION_LENGTH} caracteres`;
    }
    const imgVal = getImageValue();
    if (!imgVal) newErrors.image = 'Debes subir una imagen';
    else if (imgVal.startsWith('http') && !isValidUrl(imgVal)) {
      newErrors.image = 'Introduce una URL de imagen válida (ej: https://...)';
    }
    if (!lat.trim() || !lng.trim()) {
      newErrors.location = 'Selecciona un lugar desde el buscador de arriba';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!id) return;
    if (!validate()) return;
    const imgVal = getImageValue();
    console.log('id', id);
    updateMutation.mutate(
      {
        name: name.trim(),
        address: address.trim(),
        description: description.trim(),
        image: imgVal,
        latlng: { lat: parseFloat(lat), lng: parseFloat(lng) },
      },
      {
        onSuccess: () => (navigation as any).goBack?.(),
        onError: (err) => {
          setErrorMessage(getBackendErrorMessage(err));
        },
      }
    );
  };

  if (isLoadingRestaurant || !restaurant) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" color="#264BEB" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.safeArea}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.title}>
              Actualizar restaurante
            </ThemedText>

            <View style={styles.imageContainerWrapper}>
              <TouchableOpacity
                style={[styles.imageContainer, errors.image && styles.inputError]}
                onPress={pickImage}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <View style={styles.imagePlaceholder}>
                    <ActivityIndicator color="#264BEB" size="large" />
                    <ThemedText style={styles.imagePlaceholderText}>Subiendo...</ThemedText>
                  </View>
                ) : (image || imageUrl) ? (
                  <Image
                    source={{ uri: image || imageUrl }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="camera" size={40} color="#264BEB" />
                    <ThemedText style={styles.imagePlaceholderText}>Subir imagen</ThemedText>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <ThemedText style={styles.label}>Nombre de restaurante:</ThemedText>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={name}
              onChangeText={(t) => { setName(t); clearFieldError('name'); }}
              placeholder="Nombre del restaurante"
            />
            {errors.name ? <Text style={styles.fieldError}>{errors.name}</Text> : null}

            <ThemedText style={styles.label}>Dirección del restaurante</ThemedText>
            <View style={[styles.autocompleteWrapper, errors.location && styles.autocompleteError]}>
              <GooglePlacesAutocomplete
                ref={placesRef}
                placeholder="Buscar en Google Maps (selecciona un resultado)"
                fetchDetails
                keyboardShouldPersistTaps="handled"
                onPress={(data, details = null) => {
                  if (details) {
                    setAddress(details.formatted_address || data.description);
                    setLat(String(details.geometry.location.lat));
                    setLng(String(details.geometry.location.lng));
                    clearFieldError('location');
                  }
                }}
                onFail={(error) => console.error('Autocomplete Error:', error)}
                query={{
                  key: 'AIzaSyDJmyIuXn00Mc1xlF4eVBQcZ5OT-wAsux4',
                  language: 'es',
                }}
                debounce={400}
                minLength={2}
                enablePoweredByContainer={false}
                styles={{
                  textInput: errors.location ? [styles.input, styles.inputError] : styles.input,
                  listView: {
                    backgroundColor: '#FFF',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#eee',
                    marginTop: 5,
                    elevation: 5,
                    zIndex: 1000,
                    maxHeight: 200,
                  },
                  row: { padding: 13, height: 44, flexDirection: 'row' },
                  separator: { height: 0.5, backgroundColor: '#eee' },
                }}
              />
            </View>
            {errors.location ? <Text style={styles.fieldError}>{errors.location}</Text> : null}

            <View style={styles.formSection}>
              <ThemedText style={styles.label}>Descripción del restaurante</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                value={description}
                onChangeText={(t) => { setDescription(t); clearFieldError('description'); }}
                placeholder="Breve descripción del restaurante"
                multiline
              />
              {errors.description ? <Text style={styles.fieldError}>{errors.description}</Text> : null}
              {errors.image ? <Text style={styles.fieldError}>{errors.image}</Text> : null}
              {errorMessage ? <Text style={styles.fieldError}>{errorMessage}</Text> : null}

              <Button
                title={updateMutation.isPending ? 'Guardando...' : 'Actualizar'}
                variant="secondary"
                onPress={handleSubmit}
                loading={updateMutation.isPending}
                disabled={updateMutation.isPending}
                style={styles.submitButton}
                textStyle={{ color: '#000' }}
              />
            </View>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  keyboardAvoid: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingBottom: 60 },
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  formSection: { width: '100%', marginTop: 24, marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
    color: '#000',
  },
  inputError: { borderColor: '#FF3B30', borderWidth: 1.5 },
  fieldError: { color: '#FF3B30', fontSize: 13, marginTop: 4, marginBottom: 4 },
  textArea: { height: 100, textAlignVertical: 'top' },
  autocompleteWrapper: { zIndex: 1000, elevation: 5, marginBottom: 10 },
  autocompleteError: { borderWidth: 1.5, borderColor: '#FF3B30', borderRadius: 12 },
  imageContainerWrapper: { width: '100%', alignItems: 'center', marginBottom: 20 },
  imageContainer: { width: '80%', height: 150, borderRadius: 10, backgroundColor: '#e5e7eb', overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%', borderRadius: 10 },
  imagePlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  imagePlaceholderText: { marginTop: 8, color: '#264BEB', fontWeight: '600' },
  submitButton: {
    marginTop: 30,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
