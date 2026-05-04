import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: tự động gắn JWT token vào mọi request
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

// Response interceptor: xử lý lỗi tập trung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    
    // 401: Token hết hạn hoặc không hợp lệ -> đăng xuất
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      // Chuyển hướng về login nếu không ở trang công khai
      if (!window.location.pathname.match(/^\/(login|register|forgot-password|blog|contact)?$/)) {
        window.location.href = '/login';
      }
    }

    // 423: Tài khoản bị khóa
    if (status === 423) {
      console.error('Account is locked');
    }

    return Promise.reject(error);
  }
);

export default api;
