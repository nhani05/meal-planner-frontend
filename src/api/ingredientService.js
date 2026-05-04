import api from './api';

export const ingredientService = {
  // GET /ingredients?page=&size=&search=
  getIngredients: async (params = {}) => {
    const response = await api.get('/ingredients', { params });
    return response.data;
  },

  // GET /ingredients/{id}
  getIngredientById: async (id) => {
    const response = await api.get(`/ingredients/${id}`);
    return response.data;
  },

  // POST /ingredients
  createIngredient: async (ingredientData) => {
    const response = await api.post('/ingredients', ingredientData);
    return response.data;
  },

  // PUT /ingredients/{id}
  updateIngredient: async (id, ingredientData) => {
    const response = await api.put(`/ingredients/${id}`, ingredientData);
    return response.data;
  },

  // DELETE /ingredients/{id}
  deleteIngredient: async (id) => {
    const response = await api.delete(`/ingredients/${id}`);
    return response.data;
  },
};
