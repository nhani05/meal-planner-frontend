import api from './api';

export const dishService = {
  // GET /dishes?keyword=&categoryId=&minCal=&maxCal=&page=&size=
  getDishes: async (params = {}) => {
    const response = await api.get('/dishes', { params });
    return response.data;
  },

  // GET /dishes/{id}
  getDishById: async (id) => {
    const response = await api.get(`/dishes/${id}`);
    return response.data;
  },

  // POST /dishes — tạo món tùy chỉnh (source=custom)
  createDish: async (dishData) => {
    const response = await api.post('/dishes', dishData);
    return response.data;
  },

  // PUT /dishes/{id} — chỉ chủ sở hữu
  updateDish: async (id, dishData) => {
    const response = await api.put(`/dishes/${id}`, dishData);
    return response.data;
  },

  // DELETE /dishes/{id}
  deleteDish: async (id) => {
    const response = await api.delete(`/dishes/${id}`);
    return response.status === 204 || response.data;
  },

  // GET /dish-categories
  getCategories: async () => {
    const response = await api.get('/dish-categories');
    return response.data;
  },

  // POST /dishes/{id}/ratings — { rating, comment }
  rateDish: async (dishId, ratingData) => {
    const response = await api.post(`/dishes/${dishId}/ratings`, ratingData);
    return response.data;
  },

  // GET /dishes/{id}/ratings
  getDishRatings: async (dishId) => {
    const response = await api.get(`/dishes/${dishId}/ratings`);
    return response.data;
  },
};
