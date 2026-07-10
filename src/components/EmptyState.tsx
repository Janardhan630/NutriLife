import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  emoji: string;
  title: string;
  message: string;
  action?: ReactNode;
}

/** Friendly empty state with an optional call to action. */
export default function EmptyState({ emoji, title, message, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-3 py-16 text-center"
    >
      <span className="text-5xl" aria-hidden="true">
        {emoji}
      </span>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-gray-500 dark:text-slate-400">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  );
}
