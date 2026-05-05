import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Calendar,
  Utensils,
  List,
  User,
  LayoutDashboard,
  ChefHat,
  Heart,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Lịch thực đơn', path: '/meal-plans/manage', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Danh sách món ăn', path: '/dishes', icon: <ChefHat className="w-5 h-5" /> },
    { name: 'Món ăn của tôi', path: '/my-dishes', icon: <Utensils className="w-5 h-5" /> },
    { name: 'Yêu thích', path: '/favorites', icon: <Heart className="w-5 h-5" /> },
    { name: 'Nguyên liệu', path: '/ingredients', icon: <List className="w-5 h-5" /> },
    { name: 'Hồ sơ sức khỏe', path: '/profile', icon: <User className="w-5 h-5" /> },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
      isActive
        ? 'bg-primary/10 text-primary font-medium'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-4 right-4 z-40 p-3 rounded-full bg-primary text-white shadow-lg"
        aria-label="Mở menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold text-sm">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <NavLink key={item.path} to={item.path} className={linkClass} onClick={() => setMobileOpen(false)}>
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
              <NavLink to="/admin" className={linkClass} onClick={() => setMobileOpen(false)}>
                <LayoutDashboard className="w-5 h-5" />
                Trang Quản trị
              </NavLink>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r min-h-[calc(100vh-4rem)]">
        <div className="flex-1 py-6 px-4 space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
            Menu chính
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={linkClass}>
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t">
          <NavLink to="/admin" className={linkClass}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Trang Quản trị</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
