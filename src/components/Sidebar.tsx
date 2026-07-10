import { NavLink, Link } from 'react-router-dom';
import {
  Calculator,
  ChefHat,
  ClipboardList,
  Droplets,
  Home,
  LayoutDashboard,
  Leaf,
  TrendingUp,
  User,
  UtensilsCrossed,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const APP_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/recipes', label: 'Recipes', icon: ChefHat },
  { to: '/diet-plans', label: 'Diet Plans', icon: ClipboardList },
  { to: '/meal-tracker', label: 'Meal Tracker', icon: UtensilsCrossed },
  { to: '/calculator', label: 'Calculator', icon: Calculator },
  { to: '/water', label: 'Water', icon: Droplets },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/profile', label: 'Profile', icon: User },
];

/** Fixed desktop sidebar for the in-app (authenticated-style) layout. */
export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-gray-200 bg-white px-4 py-6 dark:border-slate-700 dark:bg-slate-800/60 lg:flex">
      <Link to="/" className="mb-8 flex items-center gap-2 px-2 font-heading text-lg font-bold">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-soft">
          <Leaf size={18} aria-hidden="true" />
        </span>
        Nutri<span className="text-primary-600 dark:text-primary-400">Life</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1" aria-label="App">
        {APP_LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-500 text-white shadow-soft'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700/60',
              )
            }
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <Link
        to="/"
        className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-700/60"
      >
        <Home size={18} aria-hidden="true" />
        Back to Home
      </Link>
    </aside>
  );
}
