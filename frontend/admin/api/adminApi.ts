interface Service {
  _id: string;
  name: string;
  status: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

const API_URL = "http://localhost:5000/api/admin";  // Ensure your API is running at this URL

// Helper function for handling requests
const fetchWithAuth = async (url: string, options: RequestInit) => {
  const token = localStorage.getItem("adminToken"); // Fetch the token stored during login

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Attach token if available
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};

// Fetching Services
export const getServices = async (): Promise<Service[]> => {
  return await fetchWithAuth(`${API_URL}/services`, { method: "GET" });
};

// Fetching Users
export const getUsers = async (): Promise<User[]> => {
  return await fetchWithAuth(`${API_URL}/users`, { method: "GET" });
};

// Approving a Service
export const approveService = async (serviceId: string): Promise<Service> => {
  return await fetchWithAuth(`${API_URL}/services/${serviceId}/approve`, { method: "PATCH" });
};

// Rejecting a Service
export const rejectService = async (serviceId: string): Promise<Service> => {
  return await fetchWithAuth(`${API_URL}/services/${serviceId}/reject`, { method: "PATCH" });
};
