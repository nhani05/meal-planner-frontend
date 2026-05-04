import api from './api';

/**
 * Helper: lấy accountId từ localStorage, throw nếu không có.
 * Tránh gửi "undefined" hoặc "null" lên backend.
 */
const getAccountId = () => {
  const id = localStorage.getItem('userId');
  if (!id) throw new Error('Chưa đăng nhập. Không tìm thấy userId.');
  return id;
};

export const mealService = {
  // GET /meal-plans/account/{accountId}
  getMealPlans: async (accountId) => {
    const id = accountId || getAccountId();
    const response = await api.get(`/meal-plans/account/${id}`);
    return response.data;
  },

  // GET /meal-plans/account/{accountId}/date/{date}
  getMealPlanByDate: async (accountId, date) => {
    const id = accountId || getAccountId();
    const response = await api.get(`/meal-plans/account/${id}/date/${date}`);
    return response.data;
  },

  // GET /meal-plans/{id}
  getMealPlanById: async (id) => {
    const response = await api.get(`/meal-plans/${id}`);
    return response.data;
  },

  // POST /meal-plans?accountId={accountId}
  createMealPlan: async (planData, accountId) => {
    const id = accountId || getAccountId();
    const response = await api.post('/meal-plans', planData, {
      params: { accountId: id }
    });
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

  // ─── Portions ───
  addPortion: async (planId, mealType, portionData) => {
    const response = await api.post(
      `/meal-plans/${planId}/meals/${mealType}/portions`,
      portionData
    );
    return response.data;
  },

  updatePortion: async (planId, mealType, portionId, portionData) => {
    const response = await api.put(
      `/meal-plans/${planId}/meals/${mealType}/portions/${portionId}`,
      portionData
    );
    return response.data;
  },

  deletePortion: async (planId, mealType, portionId) => {
    const response = await api.delete(
      `/meal-plans/${planId}/meals/${mealType}/portions/${portionId}`
    );
    return response.data;
  },

  // GET /meal-plan-templates
  getTemplates: async () => {
    const id = getAccountId();
    const response = await api.get('/meal-plan-templates', {
      params: { accountId: id }
    });
    return response.data;
  },
};
