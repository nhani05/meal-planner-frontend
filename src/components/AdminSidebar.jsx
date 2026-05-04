import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ChefHat, 
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../components/ui/button';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Tổng quan', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, end: true },
    { name: 'Quản lý Người dùng', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { name: 'Duyệt Món ăn', path: '/admin/dishes', icon: <ChefHat className="w-5 h-5" /> },
  ];

  return (
    <aside className="flex flex-col w-64 bg-slate-900 text-white min-h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-700">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <span className="font-semibold text-sm text-slate-100">Quản trị hệ thống</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm ${
                isActive
                  ? 'bg-primary/20 text-primary font-medium'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-slate-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 text-sm gap-3"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-5 h-5" />
          Về trang người dùng
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
