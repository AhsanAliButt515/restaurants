import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Restaurant } from '@/api/restaurants';

const FAVORITES_KEY = '@restaurant_favorites';

type Listener = () => void;

let cache: Restaurant[] | null = null;
let loadPromise: Promise<void> | null = null;
const listeners = new Set<Listener>();

async function ensureLoaded() {
  if (cache) return;
  if (!loadPromise) {
    loadPromise = (async () => {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      cache = stored ? (JSON.parse(stored) as Restaurant[]) : [];
    })().finally(() => {
      loadPromise = null;
    });
  }
  await loadPromise;
}

function emit() {
  for (const l of listeners) l();
}

export function subscribeFavorites(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function getFavorites() {
  await ensureLoaded();
  return cache ?? [];
}

export async function reloadFavorites() {
  cache = null;
  await ensureLoaded();
  emit();
}

export async function toggleFavorite(restaurant: Restaurant) {
  await ensureLoaded();
  const list = cache ?? [];
  const exists = list.some((r) => r._id === restaurant._id);
  const next = exists ? list.filter((r) => r._id !== restaurant._id) : [...list, restaurant];
  cache = next;
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  emit();
  return !exists;
}

