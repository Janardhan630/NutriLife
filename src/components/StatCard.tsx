import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  /** Tailwind classes for the icon badge, e.g. "bg-primary-100 text-primary-600". */
  tone?: string;
  /** Stagger index for the entrance animation. */
  index?: number;
  children?: ReactNode;
}

/** Animated dashboard stat tile with an icon badge and a big numeric value. */
export default function StatCard({
  icon,
  label,
  value,
  sublabel,
  tone = 'bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400',
  index = 0,
  children,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      className="card flex items-center gap-4 p-5"
    >
      <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl', tone)}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-slate-400">
          {label}
        </p>
        <p className="text-numeric text-2xl font-bold">{value}</p>
        {sublabel && <p className="truncate text-xs text-gray-400 dark:text-slate-500">{sublabel}</p>}
      </div>
      {children}
    </motion.div>
  );
}
