import { useMutation, useQuery } from 'react-query';
import api from '@/services/api';

export const useGetCleanerBookings = () => {
  return useQuery('cleanerBookings', async () => {
    const { data } = await api.get('/bookings/cleaner');
    return data;
  });
};

export const useUpdateBookingStatus = () => {
  return useMutation(
    ({ bookingId, status }: { bookingId: string; status: 'CONFIRMED' | 'REJECTED' }) =>
      api.put(`/bookings/${bookingId}/status`, { status })
  );
};

export const useCreateBooking = () => {
  return useMutation((bookingData: any) => api.post('/bookings', bookingData));
};

export const useGetUserBookings = () => {
  return useQuery('userBookings', async () => {
    const { data } = await api.get('/bookings/user');
    return data;
  });
};
