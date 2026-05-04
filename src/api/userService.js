import api from './api';

/**
 * Helper: lấy accountId từ localStorage, throw nếu không có.
 */
const getAccountId = () => {
  const id = localStorage.getItem('userId');
  if (!id) throw new Error('Chưa đăng nhập. Không tìm thấy userId.');
  return id;
};

export const userService = {
  // GET /health-profile/{accountId}
  getProfile: async (accountId) => {
    const id = accountId || getAccountId();
    const response = await api.get(`/health-profile/${id}`);
    return response.data;
  },

  // POST /health-profile/{accountId} (Create/Update)
  updateProfile: async (profileData, accountId) => {
    const id = accountId || getAccountId();
    const response = await api.post(`/health-profile/${id}`, profileData);
    return response.data;
  },

  // GET /health-goal/{accountId}
  getHealthGoal: async (accountId) => {
    const id = accountId || getAccountId();
    const response = await api.get(`/health-goal/${id}`);
    return response.data;
  },

  // POST /health-goal/{accountId}
  updateHealthGoal: async (goalData, accountId) => {
    const id = accountId || getAccountId();
    const response = await api.post(`/health-goal/${id}`, goalData);
    return response.data;
  },

  // Favorites
  getFavorites: async (accountId) => {
    const id = accountId || getAccountId();
    const response = await api.get(`/favorites/account/${id}`);
    return response.data;
  },

  addFavorite: async (dishId, accountId) => {
    const id = accountId || getAccountId();
    const response = await api.post(`/favorites/account/${id}/${dishId}`);
    return response.data;
  },

  removeFavorite: async (dishId, accountId) => {
    const id = accountId || getAccountId();
    const response = await api.delete(`/favorites/account/${id}/${dishId}`);
    return response.data;
  },
};
