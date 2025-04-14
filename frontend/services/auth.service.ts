import api from './api';

export const signUp = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const response = await api.post('/register', data);
  return response.data;
};

export const logout = async () => {
  try {
    const response = await api.post('/logout');
    return response.data;
  } catch (error) {
    // Even if server logout fails, ensure tokens are cleared
    throw error;
  }
};

export const login = async ({ email, password }: { email: string; password: string }) => {
  const response = await api.post('/login', {
    email,
    password,
  });

  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const cleanerSignUp = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
}) => {
  const response = await api.post('/cleaners/register', data);
  return response.data;
};

export const cleanerLogin = async ({ email, password }: { email: string; password: string }) => {
  const response = await api.post('/cleaners/login', {
    email,
    password,
  });
  return response.data;
};
