import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Flame, Menu, X } from 'lucide-react';
import Sidebar, { APP_LINKS } from '@/components/Sidebar';
import ThemeToggle from '@/components/ThemeToggle';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/cn';

/**
 * In-app layout: fixed sidebar on desktop, slide-in drawer on mobile,
 * plus a top bar with streak, theme toggle and the profile avatar.
 */
export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { profile, streak } = useApp();
  const location = useLocation();

  const pageTitle =
    APP_LINKS.find((l) => location.pathname.startsWith(l.to))?.label ?? 'NutriLife';

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <Sidebar />

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col gap-1 bg-white p-4 shadow-soft-lg dark:bg-slate-800 lg:hidden"
              aria-label="App"
            >
              <div className="mb-4 flex items-center justify-between px-2">
                <span className="font-heading text-lg font-bold">
                  Nutri<span className="text-primary-600 dark:text-primary-400">Life</span>
                </span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="rounded-full p-2 text-gray-500 dark:text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>
              {APP_LINKS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700/60',
                    )
                  }
                >
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-60">
        {/* Top bar */}
        <header className="glass sticky top-0 z-30 flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="rounded-full p-2 text-gray-600 dark:text-slate-300 lg:hidden"
            >
              <Menu size={22} />
            </button>
            <h1 className="font-heading text-lg font-semibold">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="chip bg-accent/10 text-accent dark:bg-accent-dark/10 dark:text-accent-dark"
              title="Daily streak"
            >
              <Flame size={13} aria-hidden="true" />
              <span className="text-numeric">{streak}</span> day{streak === 1 ? '' : 's'}
            </span>
            <ThemeToggle />
            <Link
              to="/profile"
              aria-label="Open profile"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-xl transition-transform hover:scale-105 dark:bg-primary-500/20"
            >
              {profile.avatar}
            </Link>
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-6xl p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
