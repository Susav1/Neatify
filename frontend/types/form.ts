export type DocumentFormData = {
  location: string;
  noOfEmployee: string;
  company: string;
  reportingDate: Date | undefined;
  dailyWorkingHours: string;
  noOfMaleWorkers: string;
  totalWorkers: string;
  observation: string;
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword?: string;
  role: 'customer' | 'cleaner'; // Changed from 'User' to specific roles
};

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role: 'customer' | 'cleaner'; // Added role to response
  message?: string;
  user?: {
    email: string;
    id: string;
  };
}

export interface ErrorResponse {
  error: true;
  msg: string;
  statusCode?: number;
}

export type ForgotPasswordFormData = {
  email: string;
};

export interface ForgotPasswordResponse {
  password: string;
  message?: string;
}

// Additional types for cleaner profile
export interface CleanerProfile {
  licenseNumber?: string;
  experience?: string;
  services?: string[];
  hourlyRate?: number;
  availability?: boolean;
}

// Extended user type
export interface UserProfile {
  id: string;
  email: string;
  role: 'customer' | 'cleaner';
  name?: string;
  phone?: string;
  cleanerProfile?: CleanerProfile;
  createdAt: Date;
  updatedAt: Date;
}

// Type for API responses
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  statusCode?: number;
  message?: string;
}