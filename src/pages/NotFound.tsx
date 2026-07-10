import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

export default function NotFound() {
  return (
    <PageTransition>
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <motion.span
          className="text-7xl"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          🥕
        </motion.span>
        <h1 className="text-numeric text-6xl font-bold text-primary-500">404</h1>
        <h2 className="text-xl font-semibold">This page went missing</h2>
        <p className="max-w-sm text-sm text-gray-500 dark:text-slate-400">
          The page you're looking for doesn't exist — maybe it was eaten. Let's get you back to
          something tasty.
        </p>
        <div className="mt-2 flex gap-3">
          <Link to="/" className="btn-primary">
            Go home
          </Link>
          <Link to="/recipes" className="btn-ghost">
            Browse recipes
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
