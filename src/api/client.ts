import { getToken } from '@/storage/auth';
import axios from 'axios';

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL
const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;