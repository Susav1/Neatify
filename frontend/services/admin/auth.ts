import adminApi from './api';

export const adminAuth = {
  login: (email: string, password: string) =>
    adminApi.post<{ token: string }>('/login', { email, password }),

  logout: () => adminApi.post('/logout'),
};
