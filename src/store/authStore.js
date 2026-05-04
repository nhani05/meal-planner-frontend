import { create } from 'zustand';

// Helper: giải mã JWT payload (không cần thư viện bên ngoài)
const decodeJwt = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

// Kiểm tra token có hết hạn chưa
const isTokenExpired = (token) => {
  if (!token) return true;
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  // Thêm buffer 30 giây để tránh race condition
  return Date.now() >= (payload.exp - 30) * 1000;
};

// Đọc token ban đầu từ localStorage, nhưng kiểm tra hạn trước
const initialToken = localStorage.getItem('token');
const tokenValid = initialToken && !isTokenExpired(initialToken);

// Nếu token đã hết hạn, dọn dẹp ngay
if (initialToken && !tokenValid) {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
}

export const useAuthStore = create((set, get) => ({
  token: tokenValid ? initialToken : null,
  role: tokenValid ? (localStorage.getItem('role') || null) : null,
  userId: tokenValid ? (localStorage.getItem('userId') || null) : null,
  isAuthenticated: tokenValid,

  login: (token, role, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', String(role).toLowerCase());
    localStorage.setItem('userId', String(userId));
    set({
      token,
      role: String(role).toLowerCase(),
      userId: String(userId),
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    set({ token: null, role: null, userId: null, isAuthenticated: false });
  },

  // Kiểm tra token còn hợp lệ không (dùng trong interceptor & route guard)
  checkAuth: () => {
    const { token, logout } = get();
    if (!token || isTokenExpired(token)) {
      logout();
      return false;
    }
    return true;
  },

  isAdmin: () => {
    const { role, checkAuth } = get();
    return checkAuth() && role === 'admin';
  },
}));
