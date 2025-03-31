import axios from 'axios';
import { Platform } from 'react-native';

const baseURL =
  Platform.OS === 'android' ? 'http://10.0.2.2:5000/admin' : 'http://localhost:5000/admin';

const adminApi = axios.create({ baseURL });

// Add auth token to requests
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalServices: number;
  revenue: number;
}

export interface Booking {
  id: string;
  status: string;
  user: { name: string };
  service: { name: string };
}

export default adminApi;
