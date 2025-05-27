'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import api from '@/services/api';
import { secureStore } from '@/helper/secure.storage.helper';
import type { ErrorResponse, LoginFormData, LoginResponse } from '@/types/form';
import { ACCESS_TOKEN_KEY, API_URL, REFRESH_TOKEN_KEY } from '@/constants';
import axios, { type AxiosError } from 'axios';
import { Alert } from 'react-native';

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  phone?: string;
  role: 'User' | 'Cleaner' | 'Admin';
}

interface AuthState {
  token: string | null;
  authenticated: boolean | null;
  user: User | null;
}

interface AuthProps {
  authState: AuthState;
  onLogin: (data: LoginFormData, isCleaner?: boolean) => Promise<LoginResponse | ErrorResponse>;
  onLogout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthProps | undefined>(undefined);

interface BackendErrorResponse {
  message?: string;
  errors?: { message: string }[];
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    authenticated: null,
    user: null,
  });
  const router = useRouter();

  const fetchUserProfile = async (token: string, isCleaner: boolean = false) => {
    try {
      console.log('[auth-context] Fetching profile with token:', token, 'isCleaner:', isCleaner);
      const endpoint = isCleaner ? '/cleaners/me' : '/profile/me';
      const response = await api.get(endpoint);
      console.log('[auth-context] Profile response:', response.data);
      if (!response.data?.id || !response.data?.email) {
        throw new Error('Invalid profile data');
      }
      return {
        id: response.data.id,
        name: response.data.name || 'Unknown',
        email: response.data.email,
        profilePicture: response.data.profilePicture,
        phone: response.data.phone,
        role: response.data.role || (isCleaner ? 'Cleaner' : 'User'),
      } as User;
    } catch (error) {
      console.error('[auth-context] Failed to fetch profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadTokens = async () => {
      try {
        console.log('[auth-context] Loading tokens');
        const token = await secureStore.getItem(ACCESS_TOKEN_KEY);
        console.log('[auth-context] Retrieved token:', token);
        if (token) {
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
          const isCleaner = (await secureStore.getItem('isCleaner')) === 'true';
          const user = await fetchUserProfile(token, isCleaner);
          if (user) {
            console.log('[auth-context] User loaded:', user);
            setAuthState({
              authenticated: true,
              token,
              user,
            });
            if (user.role === 'Cleaner') {
              router.replace('/cleaner/Home');
            } else {
              router.replace('/(home)/service');
            }
          } else {
            console.log('[auth-context] Invalid token or user, clearing storage');
            await secureStore.removeItem(ACCESS_TOKEN_KEY);
            await secureStore.removeItem(REFRESH_TOKEN_KEY);
            await secureStore.removeItem('isCleaner');
            delete axios.defaults.headers.common.Authorization;
            setAuthState({
              authenticated: false,
              token: null,
              user: null,
            });
            router.replace('/(auth)/welcome');
          }
        } else {
          console.log('[auth-context] No token found');
          setAuthState({
            authenticated: false,
            token: null,
            user: null,
          });
          router.replace('/(auth)/welcome');
        }
      } catch (error) {
        console.error('[auth-context] Error loading auth token:', error);
        setAuthState({
          authenticated: false,
          token: null,
          user: null,
        });
        router.replace('/(auth)/welcome');
      }
    };
    loadTokens();
  }, []);

  const login = async (
    data: LoginFormData,
    isCleaner: boolean = false
  ): Promise<LoginResponse | ErrorResponse> => {
    try {
      console.log('[auth-context] Attempting login with data:', data, 'isCleaner:', isCleaner);
      const endpoint = isCleaner ? '/cleaners/login' : '/login';
      const result = await api.post(`${API_URL}${endpoint}`, data);
      console.log('[auth-context] Login response:', result.data);

      if (result.data.token) {
        console.log('[auth-context] Storing tokens');
        await secureStore.setItem(ACCESS_TOKEN_KEY, result.data.token);
        await secureStore.setItem('isCleaner', isCleaner.toString());

        if (result.data.refreshToken) {
          await secureStore.setItem(REFRESH_TOKEN_KEY, result.data.refreshToken);
        }

        axios.defaults.headers.common.Authorization = `Bearer ${result.data.token}`;
        const user = await fetchUserProfile(result.data.token, isCleaner);

        if (user) {
          console.log('[auth-context] User fetched after login:', user);
          setAuthState({
            authenticated: true,
            token: result.data.token,
            user,
          });
        } else {
          console.warn('[auth-context] Profile fetch failed, setting temporary user');
          setAuthState({
            authenticated: true,
            token: result.data.token,
            user: {
              id: '',
              name: 'Loading...',
              email: data.email,
              role: isCleaner ? 'Cleaner' : 'User',
            },
          });
        }
        console.log(
          '[auth-context] Login successful, navigating to:',
          isCleaner ? '/cleaner/Home' : '/(home)/service'
        );
        router.replace(isCleaner ? '/cleaner/Home' : '/(home)/service');
        return result.data;
      }
      throw new Error('No token received from login');
    } catch (e) {
      const error = e as AxiosError<BackendErrorResponse>;
      console.error('[auth-context] Login error:', error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        error.message ||
        'An unknown error occurred';
      Alert.alert('Login Failed', errorMessage);
      return { error: true, msg: errorMessage };
    }
  };

  const logout = async () => {
    try {
      console.log('[auth-context] Logging out');
      await secureStore.removeItem(ACCESS_TOKEN_KEY);
      await secureStore.removeItem(REFRESH_TOKEN_KEY);
      await secureStore.removeItem('isCleaner');
      delete axios.defaults.headers.common.Authorization;

      setAuthState({
        authenticated: false,
        token: null,
        user: null,
      });
      router.replace('/(auth)/welcome');
    } catch (error) {
      console.error('[auth-context] Logout error:', error);
      setAuthState({
        authenticated: false,
        token: null,
        user: null,
      });
      router.replace('/(auth)/welcome');
    }
  };

  const updateUser = (userData: Partial<User>) => {
    console.log('[auth-context] Updating user:', userData);
    setAuthState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        ...userData,
      } as User,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        onLogin: login,
        onLogout: logout,
        authState,
        updateUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
