import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Leaf, Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/recipes', label: 'Recipes' },
  { to: '/diet-plans', label: 'Diet Plans' },
  { to: '/calculator', label: 'Calculator' },
];

/** Sticky glassmorphic top navigation for public pages. */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const cta = user
    ? { to: '/dashboard', label: 'Open App' }
    : { to: '/login', label: 'Sign in' };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'rounded-full px-4 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-400'
        : 'text-gray-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400',
    );

  return (
    <header className="glass sticky top-0 z-50">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <Link to="/" className="flex items-center gap-2 font-heading text-lg font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-soft">
            <Leaf size={18} aria-hidden="true" />
          </span>
          Nutri<span className="text-primary-600 dark:text-primary-400">Life</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to={cta.to} className="btn-primary hidden sm:inline-flex">
            {cta.label}
          </Link>
          <button
            type="button"
            className="rounded-full p-2 text-gray-600 dark:text-slate-300 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-200/70 dark:border-slate-700/70 md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={linkClass}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to={cta.to} className="btn-primary mt-2" onClick={() => setMobileOpen(false)}>
                {cta.label}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
