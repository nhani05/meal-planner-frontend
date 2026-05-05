import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ChefHat,
  ArrowLeft,
  ShieldCheck,
  BarChart3,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Tổng quan', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, end: true },
    { name: 'Quản lý Người dùng', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { name: 'Duyệt Món ăn', path: '/admin/dishes', icon: <ChefHat className="w-5 h-5" /> },
    { name: 'Thống kê', path: '/admin/stats', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Phản hồi', path: '/admin/feedbacks', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm ${
      isActive
        ? 'bg-primary/20 text-primary font-medium'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-slate-900 text-white shadow-lg"
        aria-label="Mở menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900 text-white flex flex-col">
            <div className="flex items-center justify-between px-4 py-5 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="font-semibold text-sm">Quản trị</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <NavLink key={item.path} to={item.path} end={item.end} className={linkClass} onClick={() => setMobileOpen(false)}>
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </nav>
            <div className="px-3 py-4 border-t border-slate-700">
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 text-sm gap-3"
                onClick={() => { navigate('/'); setMobileOpen(false); }}
              >
                <ArrowLeft className="w-5 h-5" />
                Về trang người dùng
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white min-h-[calc(100vh-4rem)]">
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
              className={linkClass}
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
    </>
  );
};

export default AdminSidebar;
