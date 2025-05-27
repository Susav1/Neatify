import api from './api';

interface ReviewPayload {
  serviceId: string;
  bookingId: string;
  rating: number;
  comment?: string;
}

export const submitReview = async (payload: ReviewPayload) => {
  try {
    console.log('[review.service] Submitting review with payload:', payload);
    const response = await api.post('/api/reviews', payload);
    console.log('[review.service] Review submitted:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      '[review.service] Error submitting review:',
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || 'Failed to submit review');
  }
};
