'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/services/api';
import { secureStore } from '@/helper/secure.storage.helper';
import type { ErrorResponse, LoginFormData, LoginResponse } from '@/types/form';
import { ACCESS_TOKEN_KEY, API_URL, REFRESH_TOKEN_KEY } from '@/constants';
import axios, { type AxiosError } from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

interface AuthState {
  token: string | null;
  authenticated: boolean | null;
  user: User | null;
}

interface AuthProps {
  authState: AuthState;
  onLogin: (data: LoginFormData) => Promise<LoginResponse | ErrorResponse>;
  onLogout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    authenticated: null,
    user: null,
  });

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const token = await secureStore.getItem(ACCESS_TOKEN_KEY);
        if (token) {
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
          const user = await fetchUserProfile(token);
          setAuthState({
            authenticated: true,
            token,
            user,
          });
        }
      } catch (error) {
        console.error('Error loading auth token:', error);
      }
    };
    loadTokens();
  }, []);

  const login = async (data: LoginFormData): Promise<LoginResponse | ErrorResponse> => {
    try {
      const result = await api.post(`${API_URL}/login`, data);

      if (result.data.token) {
        await secureStore.setItem(ACCESS_TOKEN_KEY, result.data.token);

        if (result.data.refreshToken) {
          await secureStore.setItem(REFRESH_TOKEN_KEY, result.data.refreshToken);
        }

        axios.defaults.headers.common.Authorization = `Bearer ${result.data.token}`;
        const user = await fetchUserProfile(result.data.token);

        setAuthState({
          authenticated: true,
          token: result.data.token,
          user,
        });
      }
      return result.data;
    } catch (e) {
      const error = e as AxiosError;
      return { error: true, msg: error.message || 'An unknown error occurred' };
    }
  };

  const logout = async () => {
    try {
      await secureStore.deleteItem(ACCESS_TOKEN_KEY);
      await secureStore.deleteItem(REFRESH_TOKEN_KEY);
      delete axios.defaults.headers.common.Authorization;

      setAuthState({
        authenticated: false,
        token: null,
        user: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      setAuthState({
        authenticated: false,
        token: null,
        user: null,
      });
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
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
