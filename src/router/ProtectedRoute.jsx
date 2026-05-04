import { Outlet } from 'react-router-dom';
// import { useAuthStore } from '../store/authStore';

const ProtectedRoute = () => {
  // const { isAuthenticated } = useAuthStore();
  
  // Tạm thời bỏ bảo vệ route để dễ phát triển
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }
  
  return <Outlet />;
};

export default ProtectedRoute;
