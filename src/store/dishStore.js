import { create } from 'zustand';

export const useDishStore = create((set, get) => ({
  dishes: [],
  categories: [],
  favorites: [],
  filters: {
    keyword: '',
    categoryId: '',
    minCal: '',
    maxCal: '',
  },
  isLoading: false,
  error: null,

  setDishes: (dishes) => set({ dishes }),
  setCategories: (categories) => set({ categories }),
  setFavorites: (favorites) => set({ favorites }),

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  resetFilters: () =>
    set({ filters: { keyword: '', categoryId: '', minCal: '', maxCal: '' } }),

  toggleFavoriteOptimistic: (dishId, isFav) => {
    const { favorites } = get();
    if (isFav) {
      set({ favorites: [...favorites, dishId] });
    } else {
      set({ favorites: favorites.filter((id) => id !== dishId) });
    }
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
