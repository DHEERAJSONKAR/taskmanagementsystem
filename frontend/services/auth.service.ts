import api from '../lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
  },

  async refreshToken(): Promise<{ accessToken: string }> {
    const response = await api.post('/auth/refresh');
    return response.data.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data.data;
  },
};
