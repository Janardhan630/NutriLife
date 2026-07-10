import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import AppLayout from '@/layouts/AppLayout';
import { PageSkeleton } from '@/components/Skeleton';
import { useAuth } from '@/context/AuthContext';

/* Route-level code splitting — each page ships as its own chunk. */
const Home = lazy(() => import('@/pages/Home'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Recipes = lazy(() => import('@/pages/Recipes'));
const RecipeDetail = lazy(() => import('@/pages/RecipeDetail'));
const DietPlans = lazy(() => import('@/pages/DietPlans'));
const DietPlanDetail = lazy(() => import('@/pages/DietPlanDetail'));
const MealTracker = lazy(() => import('@/pages/MealTracker'));
const NutritionCalculator = lazy(() => import('@/pages/NutritionCalculator'));
const WaterTracker = lazy(() => import('@/pages/WaterTracker'));
const ProgressPage = lazy(() => import('@/pages/ProgressPage'));
const Profile = lazy(() => import('@/pages/Profile'));
const Login = lazy(() => import('@/pages/Login'));
const NotFound = lazy(() => import('@/pages/NotFound'));

/** Gate for personal-data pages: bounce to /login, then return after auth. */
function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}

function withSuspense(node: ReactNode) {
  return <Suspense fallback={<PageSkeleton />}>{node}</Suspense>;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public marketing pages */}
      <Route element={<PublicLayout />}>
        <Route index element={withSuspense(<Home />)} />
      </Route>

      {/* Auth (no layout chrome) */}
      <Route path="/login" element={withSuspense(<Login />)} />

      {/* In-app pages with sidebar */}
      <Route element={<AppLayout />}>
        {/* Public in-app pages */}
        <Route path="/recipes" element={withSuspense(<Recipes />)} />
        <Route path="/recipes/:id" element={withSuspense(<RecipeDetail />)} />
        <Route path="/diet-plans" element={withSuspense(<DietPlans />)} />
        <Route path="/diet-plans/:id" element={withSuspense(<DietPlanDetail />)} />
        <Route path="/calculator" element={withSuspense(<NutritionCalculator />)} />

        {/* Personal-data pages require sign-in */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={withSuspense(<Dashboard />)} />
          <Route path="/meal-tracker" element={withSuspense(<MealTracker />)} />
          <Route path="/water" element={withSuspense(<WaterTracker />)} />
          <Route path="/progress" element={withSuspense(<ProgressPage />)} />
          <Route path="/profile" element={withSuspense(<Profile />)} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={withSuspense(<NotFound />)} />
      </Route>
    </Routes>
  );
}
