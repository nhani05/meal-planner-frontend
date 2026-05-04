import api from './api';

export const mealService = {
  // GET /meal-plans?startDate=&endDate=
  getMealPlans: async (startDate, endDate) => {
    const response = await api.get('/meal-plans', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // GET /meal-plans/{id}
  getMealPlanById: async (id) => {
    const response = await api.get(`/meal-plans/${id}`);
    return response.data;
  },

  // POST /meal-plans — { planDate, planName, meals: [{ mealType, portions: [{dishId, quantityG}] }] }
  createMealPlan: async (planData) => {
    const response = await api.post('/meal-plans', planData);
    return response.data;
  },

  // PUT /meal-plans/{id}
  updateMealPlan: async (id, planData) => {
    const response = await api.put(`/meal-plans/${id}`, planData);
    return response.data;
  },

  // DELETE /meal-plans/{id}
  deleteMealPlan: async (id) => {
    const response = await api.delete(`/meal-plans/${id}`);
    return response.data;
  },

  // POST /meal-plans/{planId}/meals/{mealType}/portions — { dishId, quantityG }
  addPortion: async (planId, mealType, portionData) => {
    const response = await api.post(
      `/meal-plans/${planId}/meals/${mealType}/portions`,
      portionData
    );
    return response.data;
  },

  // PUT /meal-plans/{planId}/meals/{mealType}/portions/{portionId}
  updatePortion: async (planId, mealType, portionId, portionData) => {
    const response = await api.put(
      `/meal-plans/${planId}/meals/${mealType}/portions/${portionId}`,
      portionData
    );
    return response.data;
  },

  // DELETE /meal-plans/{planId}/meals/{mealType}/portions/{portionId}
  deletePortion: async (planId, mealType, portionId) => {
    const response = await api.delete(
      `/meal-plans/${planId}/meals/${mealType}/portions/${portionId}`
    );
    return response.data;
  },

  // GET /meal-plan-templates
  getTemplates: async () => {
    const response = await api.get('/meal-plan-templates');
    return response.data;
  },

  // POST /meal-plan-templates
  createTemplate: async (templateData) => {
    const response = await api.post('/meal-plan-templates', templateData);
    return response.data;
  },

  // DELETE /meal-plan-templates/{id}
  deleteTemplate: async (id) => {
    const response = await api.delete(`/meal-plan-templates/${id}`);
    return response.data;
  },
};
