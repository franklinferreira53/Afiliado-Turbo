import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  settings?: {
    voice_preference?: 'male' | 'female';
    content_frequency?: number;
    preferred_platforms?: string[];
    categories?: string[];
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  message: string;
}

class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data;
  }

  async getProfile(): Promise<{ user: User }> {
    const response = await api.get('/auth/profile');
    return response.data;
  }

  async updateSettings(settings: User['settings']): Promise<{ user: User }> {
    const response = await api.put('/auth/settings', settings);
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  }

  storeAuth(user: User, token: string): void {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }
}

export default new AuthService();