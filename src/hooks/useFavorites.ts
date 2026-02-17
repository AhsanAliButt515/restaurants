import { useEffect, useMemo, useState } from 'react';
import type { Restaurant } from '@/api/restaurants';
import { getFavorites, reloadFavorites, subscribeFavorites, toggleFavorite } from '@/storage/favoritesStore';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const list = await getFavorites();
      if (!mounted) return;
      setFavorites(list);
      setIsLoaded(true);
    };

    load();

    const unsubscribe = subscribeFavorites(() => {
      // keep it simple: re-read from cache/storage on change
      void load();
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f._id)), [favorites]);

  const isFavorite = (id: string) => favoriteIds.has(id);

  const toggle = async (restaurant: Restaurant) => {
    await toggleFavorite(restaurant);
  };

  return {
    favorites,
    isLoaded,
    isFavorite,
    toggleFavorite: toggle,
    reloadFavorites,
  };
}

