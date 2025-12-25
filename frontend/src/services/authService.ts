import apiClient from '../api/client';


export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  email: string;
  password: string;
  username?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const register = async (userData: UserRegister): Promise<void> => {
  await apiClient.post('/auth/register', userData);
};

export const login = async (credentials: UserLogin): Promise<string> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  const { access_token } = response.data;
  localStorage.setItem('access_token', access_token);
  return access_token;
};

export const logout = (): void => {
  localStorage.removeItem('access_token');
};

export interface UserProfile {
  id: number;
  email: string;
  username: string | null;
  is_active: boolean;
  is_superuser: boolean;
}

export const getCurrentUser = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>('/auth/me');
  return response.data;
};