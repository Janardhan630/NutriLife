import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useChartTheme } from './chartTheme';

export interface TrendPoint {
  label: string;
  value: number;
}

interface TrendChartProps {
  data: TrendPoint[];
  color: string;
  unit?: string;
  name: string;
  height?: number;
  /** Fix the y-domain, e.g. weight charts shouldn't start at 0. */
  domain?: [number | 'auto' | 'dataMin', number | 'auto' | 'dataMax'];
}

/**
 * Single-series area trend chart. The title above the chart names the
 * series, so no legend box is needed; the crosshair tooltip carries
 * exact values (hover layer on by default).
 */
export default function TrendChart({
  data,
  color,
  unit = '',
  name,
  height = 260,
  domain = [0, 'auto'],
}: TrendChartProps) {
  const { colors, tooltipStyle } = useChartTheme();
  const gradientId = `trend-${color.replace('#', '')}`;

  return (
    <div style={{ width: '100%', height }} aria-label={`${name} trend chart`}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={colors.grid} strokeDasharray="3 6" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: colors.grid }}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            tick={{ fill: colors.text, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            domain={domain}
            width={56}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ stroke: colors.text, strokeDasharray: '4 4' }}
            formatter={(value) => [`${value} ${unit}`.trim(), name]}
          />
          <Area
            type="monotone"
            dataKey="value"
            name={name}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, stroke: colors.surface }}
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
