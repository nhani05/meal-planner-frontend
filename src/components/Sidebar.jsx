import { NavLink } from 'react-router-dom';
import { 
  Calendar, 
  Utensils, 
  List, 
  User, 
  LayoutDashboard,
  ChefHat,
  Heart,
  Bookmark
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Lịch thực đơn', path: '/meal-plans/manage', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Danh sách món ăn', path: '/dishes', icon: <ChefHat className="w-5 h-5" /> },
    { name: 'Món ăn của tôi', path: '/my-dishes', icon: <Utensils className="w-5 h-5" /> },
    { name: 'Yêu thích', path: '/favorites', icon: <Heart className="w-5 h-5" /> },
    { name: 'Nguyên liệu', path: '/ingredients', icon: <List className="w-5 h-5" /> },
    { name: 'Hồ sơ sức khỏe', path: '/profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r min-h-[calc(100vh-4rem)]">
      <div className="flex-1 py-6 px-4 space-y-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
          Menu chính
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      
      {/* Admin Quick Link if needed */}
      <div className="p-4 border-t">
        <NavLink
          to="/admin"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Trang Quản trị</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
