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

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
  error?: string;
}

export const createBooking = async (payload: BookingPayload) => {
  try {
    console.log('[booking.service] Creating booking with payload:', payload);
    const response = await api.post<ApiResponse<any>>('/api/bookings', payload);
    console.log('[booking.service] Booking created:', response.data);

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to create booking');
    }
  } catch (error: any) {
    console.error(
      '[booking.service] Error creating booking:',
      error.response?.data || error.message
    );

    // Handle specific error cases
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in again.');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Invalid booking data');
    } else if (error.response?.status === 404) {
      throw new Error('Service not found');
    }

    throw new Error(error.response?.data?.message || error.message || 'Failed to create booking');
  }
};

export const getUserBookings = async (status?: string) => {
  try {
    const response = await api.get('/api/bookings', { params: { status } });
    console.log('[booking.service] User bookings fetched:', response.data);

    return Array.isArray(response.data) ? response.data : response.data.data || [];
  } catch (error: any) {
    console.error(
      '[booking.service] Error fetching user bookings:',
      error.response?.data || error.message
    );

    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in again.');
    }

    throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
  }
};

export const updateBookingStatus = async (bookingId: string, status: 'CANCELLED' | 'COMPLETED') => {
  try {
    console.log('[booking.service] Updating booking status:', { bookingId, status });
    const response = await api.put<ApiResponse<any>>(`/api/bookings/${bookingId}/status`, {
      status,
    });
    console.log('[booking.service] Booking status updated:', response.data);

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to update booking status');
    }
  } catch (error: any) {
    console.error(
      '[booking.service] Error updating booking status:',
      error.response?.data || error.message
    );

    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in again.');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to update this booking');
    } else if (error.response?.status === 404) {
      throw new Error('Booking not found');
    }

    throw new Error(error.response?.data?.message || 'Failed to update booking status');
  }
};

export const getCleanerBookings = async (params: { status?: string }) => {
  try {
    const response = await api.get('/api/bookings/cleaner', {
      params: {
        status: params.status || 'PENDING',
      },
    });

    // Handle both array response and object with data property
    const bookings = Array.isArray(response.data) ? response.data : response.data.data || [];

    // Validate booking structure
    return bookings.filter(
      (booking: any) => booking && booking.id && booking.user && booking.service
    );
  } catch (error: any) {
    console.error(
      '[booking.service] Error fetching cleaner bookings:',
      error.response?.data || error.message
    );

    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in again.');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to view cleaner bookings');
    }

    throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
  }
};

// booking.service.ts
export const updateCleanerBookingStatus = async (
  bookingId: string,
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
) => {
  try {
    const response = await api.put(`/api/bookings/cleaner/${bookingId}/status`, { status });
    return response.data;
  } catch (error: any) {
    console.error('Error updating cleaner booking status:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update booking status');
  }
};
