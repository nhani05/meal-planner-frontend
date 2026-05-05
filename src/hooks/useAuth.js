import { useAuthStore } from '@/store/authStore';
import { useCallback } from 'react';

export function useAuth() {
  const store = useAuthStore();

  const checkRole = useCallback(
    (role) => {
      return store.checkAuth() && store.role === role;
    },
    [store]
  );

  return {
    token: store.token,
    userId: store.userId,
    role: store.role,
    isAuthenticated: store.isAuthenticated,
    isAdmin: store.isAdmin(),
    login: store.login,
    logout: store.logout,
    checkAuth: store.checkAuth,
    checkRole,
  };
}
