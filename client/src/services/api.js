import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD 
    ? 'https://github-repo-wskk.onrender.com/api'  // Production fallback
    : 'http://localhost:5000/api'                  // Development fallback
  );

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

// API methods
export const repositoryAPI = {
  search: (keyword, page = 1, limit = 10) =>
    api.get(`/repositories/search?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`),
  
  getAll: (params = {}) =>
    api.get('/repositories', { params }),
  
  delete: (id) =>
    api.delete(`/repositories/${id}`),
  
  getHistory: (limit = 10) =>
    api.get(`/repositories/history?limit=${limit}`)
};

export default api;