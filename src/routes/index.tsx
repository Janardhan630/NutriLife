import { lazy, Suspense, type ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import AppLayout from '@/layouts/AppLayout';
import { PageSkeleton } from '@/components/Skeleton';

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
const NotFound = lazy(() => import('@/pages/NotFound'));

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

      {/* In-app pages with sidebar */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={withSuspense(<Dashboard />)} />
        <Route path="/recipes" element={withSuspense(<Recipes />)} />
        <Route path="/recipes/:id" element={withSuspense(<RecipeDetail />)} />
        <Route path="/diet-plans" element={withSuspense(<DietPlans />)} />
        <Route path="/diet-plans/:id" element={withSuspense(<DietPlanDetail />)} />
        <Route path="/meal-tracker" element={withSuspense(<MealTracker />)} />
        <Route path="/calculator" element={withSuspense(<NutritionCalculator />)} />
        <Route path="/water" element={withSuspense(<WaterTracker />)} />
        <Route path="/progress" element={withSuspense(<ProgressPage />)} />
        <Route path="/profile" element={withSuspense(<Profile />)} />
      </Route>

      {/* Fallback */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={withSuspense(<NotFound />)} />
      </Route>
    </Routes>
  );
}
