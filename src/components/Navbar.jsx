import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Leaf } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Thực đơn', path: '/meal-plans' },
    { name: 'Công cụ tính TDEE', path: '/profile' },
    { name: 'Kiến thức dinh dưỡng', path: '/blog' },
    { name: 'Liên hệ', path: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <Link to="/" className="text-xl font-bold text-slate-800 tracking-tight">
              Nutri<span className="text-primary">Plan</span>
            </Link>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/5'
                      : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
          
          {/* Right Action Buttons */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="hidden sm:block">
                  <Button variant="ghost" className="font-medium">Đăng nhập</Button>
                </Link>
                <Link to="/register">
                  <Button className="font-medium rounded-full px-6 shadow-sm">Bắt đầu ngay</Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-primary/20 hover:border-primary/50 transition-colors">
                    <Avatar className="h-full w-full">
                      <AvatarImage src="" alt="User avatar" />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Tài khoản của tôi</p>
                      <p className="text-xs text-muted-foreground leading-none mt-1">user@example.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                    Hồ sơ sức khỏe
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/meal-plans')} className="cursor-pointer">
                    Quản lý thực đơn
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer focus:text-destructive">
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
