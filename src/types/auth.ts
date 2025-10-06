export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    email: string;
    name: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    name: string;
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
