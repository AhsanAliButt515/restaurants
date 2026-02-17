import { RestaurantCard } from '@/components/RestaurantCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFocusEffect } from '@react-navigation/native';
import { useFavorites } from '@/hooks/useFavorites';
import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

export default function FavoritesScreen() {
  const { favorites, isLoaded, toggleFavorite, reloadFavorites } = useFavorites();

  // Ensure we never render duplicate keys even if storage had duplicates
  const uniqueFavorites = useMemo(() => {
    const seen = new Set<string>();
    return favorites.filter((item: any) => {
      if (!item?._id) return false;
      if (seen.has(item._id)) return false;
      seen.add(item._id);
      return true;
    });
  }, [favorites]);

  useFocusEffect(
    useCallback(() => {
      void reloadFavorites();
    }, [reloadFavorites])
  );

  if (!isLoaded) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#264BEB" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Favoritos</ThemedText>
      </View>

      {uniqueFavorites.length > 0 ? (
        <FlatList
          data={uniqueFavorites}
          keyExtractor={(item, index) => item._id ?? `fav-${index}`}
          renderItem={({ item }) => (
            <RestaurantCard
              data={item}
              isFavorite
              onToggleFavorite={() => toggleFavorite(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContainer}>
          <ThemedText>No tienes restaurantes favoritos aún.</ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 15,
    padding: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
});
