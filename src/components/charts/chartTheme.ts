import { CHART_COLORS } from '@/constants';
import { useTheme } from '@/context/ThemeContext';

/** Resolves the validated chart palette for the active theme. */
export function useChartTheme() {
  const { theme } = useTheme();
  const colors = CHART_COLORS[theme];

  /** Shared tooltip style — a small elevated card matching the app surface. */
  const tooltipStyle: React.CSSProperties = {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.grid}`,
    borderRadius: 12,
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.14)',
    fontSize: 12,
    color: theme === 'dark' ? '#F8FAFC' : '#1F2937',
  };

  return { theme, colors, tooltipStyle };
}
