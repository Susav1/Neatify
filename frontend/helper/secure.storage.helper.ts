import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const secureStore = {
  async getItem(key: string): Promise<string | null> {
    try {
      console.log(`[secureStore] Platform.OS: ${Platform.OS}, Getting item: ${key}`);
      let value: string | null = null;
      if (Platform.OS === 'web') {
        value = localStorage.getItem(key);
        console.log(`[secureStore] Retrieved from localStorage: ${key}=${value}`);
      } else {
        value = await SecureStore.getItemAsync(key);
        console.log(`[secureStore] Retrieved from SecureStore: ${key}=${value}`);
      }
      // Basic token validation (e.g., check if it's a non-empty string)
      if (value && typeof value === 'string' && value.trim().length > 0) {
        return value;
      }
      console.warn(`[secureStore] Invalid or empty token for key: ${key}`);
      return null;
    } catch (error) {
      console.warn(`[secureStore] Failed to retrieve item: ${key}`, error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (!value || typeof value !== 'string' || value.trim().length === 0) {
        throw new Error(`Invalid value for key: ${key}`);
      }
      console.log(`[secureStore] Platform.OS: ${Platform.OS}, Setting item: ${key}=${value}`);
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
        console.log(`[secureStore] Set in localStorage: ${key}`);
      } else {
        await SecureStore.setItemAsync(key, value);
        console.log(`[secureStore] Set in SecureStore: ${key}`);
      }
    } catch (error) {
      console.warn(`[secureStore] Failed to set item: ${key}`, error);
      throw error;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      console.log(`[secureStore] Platform.OS: ${Platform.OS}, Removing item: ${key}`);
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
        console.log(`[secureStore] Removed from localStorage: ${key}`);
      } else {
        await SecureStore.deleteItemAsync(key);
        console.log(`[secureStore] Removed from SecureStore: ${key}`);
      }
    } catch (error) {
      console.warn(`[secureStore] Failed to remove item: ${key}`, error);
      throw error;
    }
  },

  async clearAll(): Promise<void> {
    try {
      console.log(`[secureStore] Platform.OS: ${Platform.OS}, Clearing all storage`);
      if (Platform.OS === 'web') {
        localStorage.clear();
        console.log(`[secureStore] Cleared localStorage`);
      } else {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        console.log(`[secureStore] Cleared known keys from SecureStore`);
      }
    } catch (error) {
      console.warn(`[secureStore] Failed to clear storage`, error);
      throw error;
    }
  },
};

export { secureStore };
