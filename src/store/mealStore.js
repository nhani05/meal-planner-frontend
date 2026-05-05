import { create } from 'zustand';
import { startOfWeek, addDays, format } from 'date-fns';

export const useMealStore = create((set, get) => ({
  // Week navigation
  selectedWeekStart: startOfWeek(new Date(), { weekStartsOn: 1 }), // Monday

  // Active plan being viewed or edited
  activePlan: null,
  activePlanMeals: [],

  // Templates
  templates: [],

  // Nutrition summary for active plan
  nutritionSummary: {
    calories: 0,
    protein: 0,
    carb: 0,
    fat: 0,
  },

  setSelectedWeekStart: (date) => set({ selectedWeekStart: date }),

  nextWeek: () => {
    const current = get().selectedWeekStart;
    set({ selectedWeekStart: addDays(current, 7) });
  },

  prevWeek: () => {
    const current = get().selectedWeekStart;
    set({ selectedWeekStart: addDays(current, -7) });
  },

  setActivePlan: (plan) => set({ activePlan: plan }),
  setActivePlanMeals: (meals) => set({ activePlanMeals: meals }),
  setTemplates: (templates) => set({ templates }),

  setNutritionSummary: (summary) => set({ nutritionSummary: summary }),

  // Calculate nutrition from portions
  calculateNutrition: (meals) => {
    let calories = 0;
    let protein = 0;
    let carb = 0;
    let fat = 0;

    meals.forEach((meal) => {
      (meal.portions || []).forEach((p) => {
        calories += p.caloriesKcal || 0;
        protein += p.proteinG || 0;
        carb += p.carbG || 0;
        fat += p.fatG || 0;
      });
    });

    set({
      nutritionSummary: {
        calories: Math.round(calories * 10) / 10,
        protein: Math.round(protein * 10) / 10,
        carb: Math.round(carb * 10) / 10,
        fat: Math.round(fat * 10) / 10,
      },
    });
  },

  // Helper: get week dates array [Mon, Tue, ..., Sun]
  getWeekDates: () => {
    const start = get().selectedWeekStart;
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  },

  // Helper: format date for API (yyyy-MM-dd)
  formatDateKey: (date) => format(date, 'yyyy-MM-dd'),
}));
