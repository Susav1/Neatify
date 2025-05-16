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
  name: string; // Added this required field
  email: string;
  password: string;
  confirmPassword: string;
  role: 'User';
};

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ErrorResponse {
  error: true;
  msg: string;
}

export type ForgotPasswordFormData = {
  email: string;
};

export interface ForgotPasswordResponse {
  password: string;
}

export type CleanerLoginFormData = {
  email: string;
  password: string;
};

export type CleanerRegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'Cleaner';
  phone: string;
};

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

interface AuthProps {
  token: string | null;
  authenticated: boolean | null;
  user: User | null;
  onLogin: (token: string, user: User) => void;
  onLogout: () => void;
  updateUser: (userData: Partial<User>) => void;
}
