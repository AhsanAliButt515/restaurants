import { RestaurantCard } from '@/components/RestaurantCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFocusEffect } from '@react-navigation/native';
import { useFavorites } from '@/hooks/useFavorites';
import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

export default function FavoritesScreen() {
  const { favorites, isLoaded, toggleFavorite, reloadFavorites } = useFavorites();

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

      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item._id}
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
