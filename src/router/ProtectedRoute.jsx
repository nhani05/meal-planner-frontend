import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * Bảo vệ các route yêu cầu đăng nhập.
 * Nếu chưa đăng nhập hoặc token hết hạn → chuyển hướng về /login
 * và lưu lại trang người dùng đang cố truy cập (để redirect sau khi login xong).
 */
const ProtectedRoute = () => {
  const { checkAuth } = useAuthStore();
  const location = useLocation();

  if (!checkAuth()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
