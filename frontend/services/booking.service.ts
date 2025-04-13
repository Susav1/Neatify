import api from './api';
import { API_URL } from '../constants';

export const createBooking = async (data: {
  serviceId: string;
  name: string;
  phone: string;
  address: string;
  notes?: string;
}) => {
  return api.post(`${API_URL}/bookings`, data);
};

export const getUserBookings = async () => {
  return api.get(`${API_URL}/bookings/user`);
};
