import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * Bảo vệ các route chỉ dành cho ADMIN.
 * - Chưa đăng nhập → /login
 * - Đăng nhập nhưng role không phải admin → / (trang chủ user)
 */
const AdminRoute = () => {
  const { checkAuth, isAdmin } = useAuthStore();

  if (!checkAuth()) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
