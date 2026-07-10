import { motion } from 'framer-motion';

interface ProgressRingProps {
  /** 0..1 */
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackClassName?: string;
  /** Center content, e.g. a value + unit. */
  label?: React.ReactNode;
}

/** Animated circular progress ring (SVG). */
export default function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 10,
  color = '#22C55E',
  trackClassName = 'stroke-gray-200 dark:stroke-slate-700',
  label,
}: ProgressRingProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped * 100)}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={trackClassName}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - clamped) }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      {label && <div className="absolute inset-0 flex items-center justify-center">{label}</div>}
    </div>
  );
}
