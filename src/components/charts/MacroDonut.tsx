import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useChartTheme } from './chartTheme';

interface MacroDonutProps {
  protein: number;
  carbs: number;
  fat: number;
  unit?: string;
  size?: number;
  /** Center label, e.g. total calories. */
  centerLabel?: { value: string; caption: string };
}

/**
 * Protein/carbs/fat donut. Slices are separated by a 2px surface-colored
 * stroke; a legend with exact values sits beside the plot so identity is
 * never carried by color alone.
 */
export default function MacroDonut({
  protein,
  carbs,
  fat,
  unit = 'g',
  size = 200,
  centerLabel,
}: MacroDonutProps) {
  const { colors, tooltipStyle } = useChartTheme();

  const data = [
    { name: 'Protein', value: protein, color: colors.protein },
    { name: 'Carbs', value: carbs, color: colors.carbs },
    { name: 'Fat', value: fat, color: colors.fat },
  ];
  const total = protein + carbs + fat;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <div style={{ width: size, height: size }} className="relative shrink-0">
        <ResponsiveContainer>
          <PieChart>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value, name) => [`${value} ${unit}`, name]}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="68%"
              outerRadius="100%"
              paddingAngle={2}
              stroke={colors.surface}
              strokeWidth={2}
              animationDuration={800}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {centerLabel && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-numeric text-2xl font-bold">{centerLabel.value}</span>
            <span className="text-xs text-gray-500 dark:text-slate-400">{centerLabel.caption}</span>
          </div>
        )}
      </div>

      {/* Legend with exact values — identity never rides on color alone */}
      <ul className="space-y-2.5" aria-label="Macro breakdown">
        {data.map((entry) => (
          <li key={entry.name} className="flex items-center gap-2.5 text-sm">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
              aria-hidden="true"
            />
            <span className="w-16 font-medium">{entry.name}</span>
            <span className="text-numeric font-semibold">
              {Math.round(entry.value)} {unit}
            </span>
            {total > 0 && (
              <span className="text-numeric text-xs text-gray-400 dark:text-slate-500">
                {Math.round((entry.value / total) * 100)}%
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
