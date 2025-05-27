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
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'User';
  phone?: string;
};

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

export type MessageData = {
  bookingId: string;
  content: string;
};

export interface LoginResponse {
  token: string;
  refreshToken?: string;
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

export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  phone?: string;
  role?: string; // Added role
}

export interface AuthProps {
  authState: {
    token: string | null;
    authenticated: boolean | null;
    user: User | null;
  };
  onLogin: (data: LoginFormData, isCleaner?: boolean) => Promise<LoginResponse | ErrorResponse>;
  onLogout: () => void;
  updateUser: (userData: Partial<User>) => void;
}
