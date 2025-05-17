import api from '../services/api';

interface BookingPayload {
  serviceId: string;
  date: string;
  time: string;
  location: string;
  paymentMethod: 'CASH' | 'KHALTI';
  duration: number;
  notes?: string;
  areas?: string[];
}

interface UpdateStatusPayload {
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
}

export const createBooking = async (payload: BookingPayload) => {
  try {
    const response = await api.post('/api/bookings', payload);
    return response.data.data;
  } catch (error: any) {
    console.error('Error creating booking:', error);
    throw new Error(error.response?.data?.message || 'Failed to create booking');
  }
};

export const verifyPayment = async (pidx: string) => {
  try {
    const response = await api.post('/api/bookings/verify-payment', { pidx });
    return response.data;
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    throw new Error(error.response?.data?.message || 'Failed to verify payment');
  }
};

export const getUserBookings = async (status?: string) => {
  try {
    const response = await api.get('/api/bookings', { params: { status } });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user bookings:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
  }
};

export const updateBookingStatus = async (bookingId: string, status: 'CANCELLED' | 'COMPLETED') => {
  try {
    const response = await api.put(`/api/bookings/${bookingId}/status`, { status });
    return response.data;
  } catch (error: any) {
    console.error('Error updating booking status:', error);
    throw new Error(error.response?.data?.message || 'Failed to update booking status');
  }
};

export const getCleanerBookings = async (params: { status?: string }) => {
  try {
    const response = await api.get('/api/bookings/cleaner', { params });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching cleaner bookings:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
  }
};

export const updateCleanerBookingStatus = async (
  bookingId: string,
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
) => {
  try {
    const response = await api.put(`/api/bookings/cleaner/${bookingId}/status`, { status });
    return response.data;
  } catch (error: any) {
    console.error('Error updating cleaner booking status:', error);
    throw new Error(error.response?.data?.message || 'Failed to update booking status');
  }
};
