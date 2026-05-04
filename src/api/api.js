import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 giây — tránh request treo mãi
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor ─────────────────────────────────────────────────────
// Tự động gắn JWT token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ────────────────────────────────────────────────────
// Xử lý lỗi tập trung từ phía server
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const PUBLIC_PATHS = /^\/(login|register|forgot-password|blog|contact)?\/?$/;

    switch (status) {
      // 401: Token hết hạn hoặc không hợp lệ
      case 401:
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        if (!PUBLIC_PATHS.test(window.location.pathname)) {
          window.location.replace('/login');
        }
        break;

      // 403: Không đủ quyền (user cố truy cập endpoint admin)
      case 403:
        console.warn('[API] Forbidden: không đủ quyền truy cập tài nguyên này.');
        window.location.replace('/');
        break;

      // 423: Tài khoản bị khóa
      case 423:
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        window.location.replace('/login?reason=locked');
        break;

      // 410: Tài khoản bị xóa mềm
      case 410:
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        window.location.replace('/login?reason=deleted');
        break;

      // 500+: Lỗi server — log nhẹ, không expose chi tiết ra UI
      default:
        if (status >= 500) {
          console.error('[API] Server error:', status);
        }
    }

    return Promise.reject(error);
  }
);

export default api;
