'use client';

import { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { generateChartData, formatTime } from '../lib/data';

interface PriceComparisonChartProps {
  type: 'time' | 'distance';
}

const COLORS = {
  CityBee: { fill: '#f97316', stroke: '#fb923c' },
  Bolt: { fill: '#22c55e', stroke: '#4ade80' },
  CarGuru: { fill: '#3b82f6', stroke: '#60a5fa' },
};

interface ChartPoint {
  x: number;
  y: number;
  z: number;
  name: string;
  time: number;
  distance: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CustomTooltip = ({ active, payload, type }: { active?: boolean; payload?: Array<{ payload: ChartPoint }>; type: string }) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  return (
    <div className="glass-card px-4 py-3 border border-zinc-700/50 text-sm">
      <p className="font-semibold text-white mb-1">{data.name}</p>
      <div className="space-y-0.5 text-zinc-400">
        <p>Time: {formatTime(data.time)}</p>
        <p>Distance: {data.distance} km</p>
        <p className="text-white font-medium">Price: €{data.y.toFixed(2)}</p>
      </div>
    </div>
  );
};

const formatXAxis = (value: number, type: string) => {
  if (type === 'time') {
    if (value < 60) return `${Math.round(value)}m`;
    if (value < 1440) return `${Math.floor(value / 60)}h`;
    return `${Math.floor(value / 1440)}d`;
  }
  return `${Math.round(value)}km`;
};

export default function PriceComparisonChart({ type }: PriceComparisonChartProps) {
  const { cityBeePoints, boltPoints, carGuruPoints } = useMemo(() => {
    const { cityBeeData, boltData, carGuruData } = generateChartData([], type);

    const mapPoint = (d: { x: number; y: number; r: number; name: string; time: number; distance: number }) => ({
      x: d.x,
      y: d.y,
      z: d.r * 20,
      name: d.name,
      time: d.time,
      distance: d.distance,
    });

    return {
      cityBeePoints: cityBeeData.map(mapPoint),
      boltPoints: boltData.map(mapPoint),
      carGuruPoints: carGuruData.map(mapPoint),
    };
  }, [type]);

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
          <XAxis
            type="number"
            dataKey="x"
            name={type === 'time' ? 'Time' : 'Distance'}
            tickFormatter={(v) => formatXAxis(v, type)}
            stroke="#3f3f46"
            tick={{ fill: '#71717a', fontSize: 11 }}
            axisLine={{ stroke: '#27272a' }}
            label={{
              value: type === 'time' ? 'Time' : 'Distance (km)',
              position: 'bottom',
              offset: 5,
              fill: '#52525b',
              fontSize: 12,
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Price"
            tickFormatter={(v) => `€${Math.round(v)}`}
            stroke="#3f3f46"
            tick={{ fill: '#71717a', fontSize: 11 }}
            axisLine={{ stroke: '#27272a' }}
            label={{
              value: 'Price (€)',
              angle: -90,
              position: 'insideLeft',
              offset: 10,
              fill: '#52525b',
              fontSize: 12,
            }}
          />
          <ZAxis type="number" dataKey="z" range={[40, 400]} />
          <Tooltip content={<CustomTooltip type={type} />} />
          <Legend
            wrapperStyle={{ paddingTop: '10px' }}
            formatter={(value: string) => (
              <span className="text-zinc-400 text-xs">{value}</span>
            )}
          />
          <Scatter
            name="CityBee"
            data={cityBeePoints}
            fill={COLORS.CityBee.fill}
            stroke={COLORS.CityBee.stroke}
            strokeWidth={1}
            fillOpacity={0.6}
          />
          <Scatter
            name="Bolt"
            data={boltPoints}
            fill={COLORS.Bolt.fill}
            stroke={COLORS.Bolt.stroke}
            strokeWidth={1}
            fillOpacity={0.6}
          />
          <Scatter
            name="CarGuru"
            data={carGuruPoints}
            fill={COLORS.CarGuru.fill}
            stroke={COLORS.CarGuru.stroke}
            strokeWidth={1}
            fillOpacity={0.6}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
