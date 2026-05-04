import { Outlet } from 'react-router-dom';

const AdminRoute = () => {
  // TODO: Replace with real admin check from zustand
  // const role = 'admin';
  
  // Tạm thời bỏ bảo vệ route để dễ phát triển
  // if (role !== 'admin') {
  //   return <Navigate to="/" replace />;
  // }
  
  return <Outlet />;
};

export default AdminRoute;
