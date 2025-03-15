import api from './api';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

interface RegisterData {
  username: string;
  password: string;
  role?: string;
}

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    const token = response.data.access_token;
    
    // Store token in localStorage
    localStorage.setItem('token', token);
    
    // Log success (for debugging)
    console.log('Login successful, token stored in localStorage');
    
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem('token') !== null;
  }
};

export default AuthService;

