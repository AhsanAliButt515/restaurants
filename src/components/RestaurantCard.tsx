import { Restaurant } from '@/api/restaurants';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { CustomStarRating } from './CustomStarRating';

const GOOGLE_GEOCODE_KEY = 'AIzaSyDJmyIuXn00Mc1xlF4eVBQcZ5OT-wAsux4';

type Props = {
  data: Restaurant;
  isFavorite: boolean;
  hideComments?: boolean;
  onToggleFavorite: (restaurant: Restaurant) => void;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  cardStyle?: StyleProp<ViewStyle>;
};

export const RestaurantCard = ({ data, isFavorite, hideComments, onToggleFavorite, onPress, containerStyle, cardStyle }: Props) => {
  const navigation = useNavigation();
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);

  // Reverse geocode lat/lng to address when API doesn't provide one
  useEffect(() => {
    if (data.address?.trim()) {
      setResolvedAddress(null);
      return;
    }
    const lat = data.latlng?.lat;
    const lng = data.latlng?.lng;
    if (lat == null || lng == null) return;

    let cancelled = false;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_GEOCODE_KEY}&language=es`;
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled || !json.results?.[0]) return;
        setResolvedAddress(json.results[0].formatted_address ?? null);
      })
      .catch(() => { });
    return () => { cancelled = true; };
  }, [data._id, data.address, data.latlng?.lat, data.latlng?.lng]);

  const displayAddress = data.address?.trim() || resolvedAddress || null;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.card, cardStyle]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => (onPress ? onPress() : (navigation as any).navigate('RestaurantDetail', { id: data._id }))}
          style={styles.cardContent}
        >
          <Image source={{ uri: data.image }} style={styles.image} />

          <View style={styles.info}>
            <Text style={styles.name}>{data.name}</Text>
            {displayAddress ? (
              <Text style={styles.description} numberOfLines={2}>{displayAddress}</Text>
            ) : null}


            <View style={styles.bottomRow}>
              <CustomStarRating
                rating={data?.avgRating || 0}
                size={16}
              />
              {!hideComments && <Text style={styles.price}>({data.reviews?.length} comentarios)</Text>}
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.favoriteContainer}>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => onToggleFavorite(data)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#000" : "#666"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 80,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteContainer: {
    width: 50,

    alignItems: 'center',


  },
  favoriteButton: {
    padding: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderBottomRightRadius: 16,
    borderTopRightRadius: 16,
  },
  info: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#0B0B0B',
    marginVertical: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});
