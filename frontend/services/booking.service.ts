import api from './api';

export const createBooking = async (bookingData: {
  serviceId: string;
  date: Date;
  time: string;
  location: string;
  paymentMethod: 'cash' | 'khalti';
  notes?: string;
  areas?: any;
  duration?: number;
}) => {
  try {
    const response = await api.post('/api/bookings', {
      ...bookingData,
      paymentMethod: bookingData.paymentMethod.toUpperCase(),
    });
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getUserBookings = async (status?: string) => {
  try {
    const params = status ? { status } : {};
    const response = await api.get('/api/bookings', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

export const updateBookingStatus = async (
  bookingId: string,
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
) => {
  try {
    const response = await api.put(`/api/bookings/${bookingId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

export const getCleanerBookings = async (status?: string) => {
  try {
    const params = status ? { status } : {};
    const response = await api.get('/api/bookings/cleaner', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching cleaner bookings:', error);
    throw error;
  }
};

export const updateCleanerBookingStatus = async (
  bookingId: string,
  status: 'CONFIRMED' | 'CANCELLED'
) => {
  try {
    const response = await api.put(`/api/bookings/cleaner/${bookingId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};
