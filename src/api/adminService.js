import api from './api';

export const adminService = {
  // GET /admin/statistics?startDate=&endDate=
  getStats: async (startDate, endDate) => {
    const response = await api.get('/admin/statistics', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // GET /admin/users?keyword=&status=&page=&size=
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // GET /admin/users/{id}
  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // PATCH /admin/users/{id}/lock
  lockUser: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/lock`);
    return response.data;
  },

  // PATCH /admin/users/{id}/unlock
  unlockUser: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/unlock`);
    return response.data;
  },

  // DELETE /admin/users/{id} — soft delete
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // GET /admin/dishes?keyword=&categoryId=&page=&size=
  getAllDishesAdmin: async (params = {}) => {
    const response = await api.get('/admin/dishes', { params });
    return response.data;
  },

  // POST /admin/dishes — tạo món hệ thống (source=system)
  createSystemDish: async (dishData) => {
    const response = await api.post('/admin/dishes', dishData);
    return response.data;
  },

  // PUT /admin/dishes/{id}
  updateDishAdmin: async (id, dishData) => {
    const response = await api.put(`/admin/dishes/${id}`, dishData);
    return response.data;
  },

  // DELETE /admin/dishes/{id}
  deleteDishAdmin: async (id) => {
    const response = await api.delete(`/admin/dishes/${id}`);
    return response.data;
  },

  // GET /admin/feedbacks?status=&page=&size=
  getFeedbacks: async (params = {}) => {
    const response = await api.get('/admin/feedbacks', { params });
    return response.data;
  },

  // PATCH /admin/feedbacks/{id}/status — { status: 'pending'|'processing'|'resolved' }
  updateFeedbackStatus: async (id, status) => {
    const response = await api.patch(`/admin/feedbacks/${id}/status`, { status });
    return response.data;
  },
};
