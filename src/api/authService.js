import api from './api';

export const authService = {
  // POST /auth/login — { username, password }
  // Response: { token, tokenType, expiresIn, role, userId }
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // POST /auth/register — { username, email, password }
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // POST /auth/logout — requires Bearer token
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // POST /auth/forgot-password — { email }
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // POST /auth/verify-otp — { email, otp }
  verifyOtp: async (email, otp) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  // POST /auth/reset-password — { token, newPassword }
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  },

  // PUT /auth/change-password — requires Bearer token
  changePassword: async (oldPassword, newPassword) => {
    const response = await api.put('/auth/change-password', { oldPassword, newPassword });
    return response.data;
  },
};
