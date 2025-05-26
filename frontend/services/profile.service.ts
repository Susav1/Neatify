import api from './api';
import { API_URL } from '@/constants';

export const updateProfile = async (data: { name?: string; phone?: string }) => {
  try {
    console.log('[profile.service] Updating profile with data:', data);
    const response = await api.put('/profile/me', data);
    console.log('[profile.service] Update profile response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[profile.service] Update profile error:', error.response?.data || error.message);
    throw error;
  }
};

export const uploadProfilePicture = async (formData: FormData) => {
  try {
    console.log('[profile.service] Uploading profile picture');
    const response = await api.post('/profile/upload-profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('[profile.service] Upload profile picture response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      '[profile.service] Upload profile picture error:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getProfile = async () => {
  try {
    console.log('[profile.service] Fetching profile');
    const response = await api.get('/profile/me');
    console.log('[profile.service] Profile response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[profile.service] Profile error:', error.response?.data || error.message);
    throw error;
  }
};
