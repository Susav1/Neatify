import { createContext, useContext, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { secureStore } from '@/helper/secure.storage.helper';
import { ACCESS_TOKEN_KEY, API_URL, REFRESH_TOKEN_KEY } from '@/constants';
import api from '@/services/api';
import type { LoginFormData, LoginResponse, ErrorResponse } from '@/types/form';

interface AuthState {
  token: string | null;
  authenticated: boolean;
  role: 'customer' | 'cleaner' | null;
  isLoading: boolean;
}

interface AuthContextType {
  authState: AuthState;
  onLogin: (data: LoginFormData) => Promise<LoginResponse | ErrorResponse>;
  onLogout: () => Promise<void>;
  initialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    authenticated: false,
    role: null,
    isLoading: true
  });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await secureStore.getItem(ACCESS_TOKEN_KEY);
        if (token) {
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
          setAuthState({
            token,
            authenticated: true,
            role: null,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Failed to load token:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      } finally {
        setInitialized(true);
      }
    };

    loadToken();
  }, []);

  const login = async (data: LoginFormData): Promise<LoginResponse | ErrorResponse> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await api.post<LoginResponse>(`${API_URL}/login`, data);
      const { accessToken: token, refreshToken, role } = response.data;

      await secureStore.setItem(ACCESS_TOKEN_KEY, token);
      if (refreshToken) {
        await secureStore.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
      
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      setAuthState({
        token,
        authenticated: true,
        role,
        isLoading: false
      });

      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      console.error('Login error:', err);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { 
        error: true, 
        msg: err.response?.data?.msg || err.message || 'Login failed. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      await secureStore.deleteItem(ACCESS_TOKEN_KEY);
      await secureStore.deleteItem(REFRESH_TOKEN_KEY);
      axios.defaults.headers.common.Authorization = '';
      
      setAuthState({
        token: null,
        authenticated: false,
        role: null,
        isLoading: false
      });
    } catch (error) {
      console.error('Logout error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        onLogin: login,
        onLogout: logout,
        initialized
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};