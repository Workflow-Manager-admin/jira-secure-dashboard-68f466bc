import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://vscode-internal-69-beta.beta01.cloud.kavia.ai:3001';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // PUBLIC_INTERFACE
  /**
   * Authenticate user with Jira credentials
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User's Jira email
   * @param {string} credentials.jira_domain - Jira domain
   * @param {string} credentials.api_token - Jira API token
   * @returns {Promise<Object>} Authentication response
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      throw new Error(errorMessage);
    }
  },

  // PUBLIC_INTERFACE
  /**
   * Logout current user
   * @returns {Promise<Object>} Logout response
   */
  async logout() {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Logout failed';
      throw new Error(errorMessage);
    }
  },

  // PUBLIC_INTERFACE
  /**
   * Get current user information
   * @returns {Promise<Object>} User information
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to get user info';
      throw new Error(errorMessage);
    }
  }
};

export default api;
