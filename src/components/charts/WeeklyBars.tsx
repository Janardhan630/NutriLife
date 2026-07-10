import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useChartTheme } from './chartTheme';

interface WeeklyBarsProps {
  data: { label: string; value: number }[];
  color: string;
  name: string;
  unit?: string;
  /** Optional target line (e.g. daily calorie goal). */
  target?: number;
  height?: number;
}

/**
 * Single-series bar chart with rounded data-ends and an optional dashed
 * target reference line. Title carries the series name — no legend needed.
 */
export default function WeeklyBars({
  data,
  color,
  name,
  unit = '',
  target,
  height = 240,
}: WeeklyBarsProps) {
  const { colors, tooltipStyle } = useChartTheme();

  return (
    <div style={{ width: '100%', height }} aria-label={`${name} bar chart`}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }} barCategoryGap="30%">
          <CartesianGrid stroke={colors.grid} strokeDasharray="3 6" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: colors.grid }}
          />
          <YAxis tick={{ fill: colors.text, fontSize: 11 }} tickLine={false} axisLine={false} width={56} />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ fill: colors.grid, opacity: 0.35 }}
            formatter={(value) => [`${value} ${unit}`.trim(), name]}
          />
          {target !== undefined && (
            <ReferenceLine
              y={target}
              stroke={colors.text}
              strokeDasharray="6 4"
              label={{ value: 'Goal', position: 'insideTopRight', fill: colors.text, fontSize: 11 }}
            />
          )}
          <Bar dataKey="value" name={name} fill={color} radius={[4, 4, 0, 0]} animationDuration={700} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
