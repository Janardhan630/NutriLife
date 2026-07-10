import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Recipes', to: '/recipes' },
      { label: 'Diet Plans', to: '/diet-plans' },
      { label: 'Calculator', to: '/calculator' },
    ],
  },
  {
    title: 'Track',
    links: [
      { label: 'Meal Tracker', to: '/meal-tracker' },
      { label: 'Water Tracker', to: '/water' },
      { label: 'Progress', to: '/progress' },
      { label: 'Profile', to: '/profile' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <Link to="/" className="mb-3 flex items-center gap-2 font-heading text-lg font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary-500 text-white">
              <Leaf size={18} aria-hidden="true" />
            </span>
            Nutri<span className="text-primary-600 dark:text-primary-400">Life</span>
          </Link>
          <p className="max-w-xs text-sm text-gray-500 dark:text-slate-400">
            Eat smart, live well. Track meals, discover recipes and reach your goals — all in one
            beautiful app.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="mb-3 text-sm font-semibold">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-500 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-gray-200 py-5 text-center text-xs text-gray-400 dark:border-slate-700 dark:text-slate-500">
        © {new Date().getFullYear()} NutriLife. Made with 🥗 for healthy living.
      </div>
    </footer>
  );
}
