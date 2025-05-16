import api from './api';

// Create a new service
export const createService = async (serviceData) => {
  try {
    const response = await api.post('/services/create', serviceData);
    return response.data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

// Get all services
export const getAllServices = async () => {
  try {
    const response = await api.get('/services');
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

// Get a service by ID
export const getServiceById = async (serviceId) => {
  try {
    const response = await api.get(`/services/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service by ID:', error);
    throw error;
  }
};
