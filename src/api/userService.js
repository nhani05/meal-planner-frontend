import api from './api';

export const userService = {
  // GET /users/me
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // PUT /users/me/profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/me/profile', profileData);
    return response.data;
  },

  // GET /users/me/health-goal
  getHealthGoal: async () => {
    const response = await api.get('/users/me/health-goal');
    return response.data;
  },

  // PUT /users/me/health-goal
  updateHealthGoal: async (goalData) => {
    const response = await api.put('/users/me/health-goal', goalData);
    return response.data;
  },

  // GET /users/me/favorites
  getFavorites: async () => {
    const response = await api.get('/users/me/favorites');
    return response.data;
  },

  // POST /users/me/favorites/{dishId}
  addFavorite: async (dishId) => {
    const response = await api.post(`/users/me/favorites/${dishId}`);
    return response.data;
  },

  // DELETE /users/me/favorites/{dishId}
  removeFavorite: async (dishId) => {
    const response = await api.delete(`/users/me/favorites/${dishId}`);
    return response.data;
  },
};
