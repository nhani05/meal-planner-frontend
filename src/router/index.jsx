import { createBrowserRouter, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AdminSidebar from '../components/AdminSidebar';
import ProtectedRoute from './ProtectedRoute';
import { Toaster } from '../components/ui/toaster';

// Public pages
import HomePage from '../features/public/HomePage';
import BlogPage from '../features/public/BlogPage';
import ContactPage from '../features/public/ContactPage';

// Auth
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage';

// User features
import ProfilePage from '../features/profile/ProfilePage';
import MealCalendarPage from '../features/mealplan/MealCalendarPage';
import MealDetailPage from '../features/mealplan/MealDetailPage';
import CreateMealPlanPage from '../features/mealplan/CreateMealPlanPage';
import IngredientPage from '../features/dish/IngredientPage';
import DishPage from '../features/dish/DishPage';
import CreateDishPage from '../features/dish/CreateDishPage';

// Admin pages
import AdminDashboardPage from '../features/admin/AdminDashboardPage';
import AdminUserPage from '../features/admin/AdminUserPage';
import AdminDishPage from '../features/admin/AdminDishPage';

// ─── Layouts ─────────────────────────────────────────────
const PublicLayout = () => (
  <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
    <Navbar />
    <main className="flex-1 w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <Outlet />
    </main>
    <Toaster />
  </div>
);

const DashboardLayout = () => (
  <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
    <Navbar />
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
    <Toaster />
  </div>
);

const AdminLayout = () => (
  <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
    <div className="flex flex-1 overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
    <Toaster />
  </div>
);

// ─── Router ───────────────────────────────────────────────
const router = createBrowserRouter([
  // Public routes (Navbar only)
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },

  // Dashboard routes (Navbar + Sidebar)
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'meal-plans', element: <MealCalendarPage /> },
          { path: 'meal-plans/new', element: <CreateMealPlanPage /> },
          { path: 'meal-plans/:id', element: <MealDetailPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'ingredients', element: <IngredientPage /> },
          { path: 'dishes', element: <DishPage /> },
          { path: 'dishes/new', element: <CreateDishPage /> },
          { path: 'dishes/:id/edit', element: <CreateDishPage /> },
        ],
      },
    ],
  },

  // Admin routes (AdminSidebar only, no top Navbar)
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'users', element: <AdminUserPage /> },
      { path: 'dishes', element: <AdminDishPage /> },
    ],
  },
]);

export default router;
