import { createBrowserRouter, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AdminSidebar from '../components/AdminSidebar';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import { Toaster } from '../components/ui/toaster';

// Public pages
import HomePage from '../features/public/HomePage';
import BlogPage from '../features/public/BlogPage';
import ContactPage from '../features/public/ContactPage';
import MealPlanLandingPage from '../features/public/MealPlanLandingPage';
import TDEELandingPage from '../features/public/TDEELandingPage';

// Auth
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage';

// User features
import ProfilePage from '../features/profile/ProfilePage';
import GoalsPage from '../features/profile/GoalsPage';
import MealCalendarPage from '../features/mealplan/MealCalendarPage';
import MealDetailPage from '../features/mealplan/MealDetailPage';
import CreateMealPlanPage from '../features/mealplan/CreateMealPlanPage';
import IngredientPage from '../features/dish/IngredientPage';
import DishPage from '../features/dish/DishPage';
import DishDetailPage from '../features/dish/DishDetailPage';
import CreateDishPage from '../features/dish/CreateDishPage';
import MyDishesPage from '../features/dish/MyDishesPage';
import FavoritesPage from '../features/dish/FavoritesPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import ResetPasswordPage from '../features/auth/ResetPasswordPage';

// Admin pages
import AdminDashboardPage from '../features/admin/AdminDashboardPage';
import AdminUserPage from '../features/admin/AdminUserPage';
import AdminDishPage from '../features/admin/AdminDishPage';
import AdminStatsPage from '../features/admin/AdminStatsPage';
import AdminFeedbackPage from '../features/admin/AdminFeedbackPage';
import ServiceTestConsole from '../features/test/ServiceTestConsole';

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
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'meal-plans', element: <MealPlanLandingPage /> },
      { path: 'tdee', element: <TDEELandingPage /> },
      { path: 'test/services', element: <ServiceTestConsole /> },
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
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'meal-plans/manage', element: <MealCalendarPage /> },
          { path: 'meal-plans/new', element: <CreateMealPlanPage /> },
          { path: 'meal-plans/:id', element: <MealDetailPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'profile/goals', element: <GoalsPage /> },
          { path: 'ingredients', element: <IngredientPage /> },
          { path: 'dishes', element: <DishPage /> },
          { path: 'dishes/:id', element: <DishDetailPage /> },
          { path: 'dishes/new', element: <CreateDishPage /> },
          { path: 'dishes/:id/edit', element: <CreateDishPage /> },
          { path: 'my-dishes', element: <MyDishesPage /> },
          { path: 'favorites', element: <FavoritesPage /> },
        ],
      },
    ],
  },

  // Admin routes (AdminSidebar only, no top Navbar)
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        element: <AdminRoute />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'users', element: <AdminUserPage /> },
          { path: 'dishes', element: <AdminDishPage /> },
          { path: 'stats', element: <AdminStatsPage /> },
          { path: 'feedbacks', element: <AdminFeedbackPage /> },
        ],
      },
    ],
  },
]);

export default router;
