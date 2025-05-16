import axios from 'axios';
import { secureStore } from '@/helper/secure.storage.helper';
import { ACCESS_TOKEN_KEY, API_URL } from '@/constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await secureStore.getItem(ACCESS_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Added auth token to request');
      } else {
        console.log('No auth token available for request');
      }
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

export default api;
