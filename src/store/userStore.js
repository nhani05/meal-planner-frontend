import { create } from 'zustand';

export const useUserStore = create((set) => ({
  profile: null,
  healthGoal: null,
  
  setProfile: (profile) => set({ profile }),
  setHealthGoal: (healthGoal) => set({ healthGoal }),
  clearUser: () => set({ profile: null, healthGoal: null }),
}));
