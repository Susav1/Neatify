import api from './api';

export const signUp = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  try {
    console.log('[auth.service] Registering user with data:', data);
    const response = await api.post('/register', data);
    console.log('[auth.service] Register response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[auth.service] Register error:', error.response?.data || error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    console.log('[auth.service] Logging out');
    const response = await api.post('/logout');
    console.log('[auth.service] Logout response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[auth.service] Logout error:', error);
    throw error;
  }
};

export const login = async ({ email, password }: { email: string; password: string }) => {
  try {
    console.log('[auth.service] Logging in with data:', { email, password });
    const response = await api.post('/login', { email, password });
    console.log('[auth.service] Login response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[auth.service] Login error:', error.response?.data || error.message);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    console.log('[auth.service] Fetching profile');
    const response = await api.get('/profile/me');
    console.log('[auth.service] Profile response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[auth.service] Profile error:', error.response?.data || error.message);
    throw error;
  }
};

export const cleanerSignUp = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
}) => {
  try {
    console.log('[auth.service] Registering cleaner with data:', data);
    const response = await api.post('/cleaners/register', data);
    console.log('[auth.service] Cleaner register response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[auth.service] Cleaner register error:', error.response?.data || error.message);
    throw error;
  }
};

export const cleanerLogin = async ({ email, password }: { email: string; password: string }) => {
  try {
    console.log('[auth.service] Cleaner logging in with data:', { email, password });
    const response = await api.post('/cleaners/login', { email, password });
    console.log('[auth.service] Cleaner login response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[auth.service] Cleaner login error:', error.response?.data || error.message);
    throw error;
  }
};
