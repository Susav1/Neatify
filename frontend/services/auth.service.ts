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
  const response = await api.post('/logout');
  return response.data;
};
export const login = async ({ email, password }: { email: string; password: string }) => {
  const response = await api.post('/login', {
    email,
    password,
  });

  return response.data;
};
