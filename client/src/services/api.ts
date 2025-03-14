import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    
    // Log token status (for debugging)
    if (token) {
      console.log(`Adding token to request: ${config.url}`);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn(`No token found for request: ${config.url}`);
    }
    
    return config;
  },
  (error: any): Promise<any> => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    console.log(`Response success: ${response.config.url}`, response.status);
    return response;
  },
  (error: any): Promise<any> => {
    console.error(`Response error: ${error.config?.url}`, error.response?.status, error.message);
    
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized access detected, redirecting to login');
      // Unauthorized, clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
