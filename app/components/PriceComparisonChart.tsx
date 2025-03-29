'use client';

import { useEffect, useState } from 'react';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend, ScatterController, TimeScale, CategoryScale } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { generateChartData } from '../lib/data';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ScatterController,
  TimeScale,
  CategoryScale
);

interface PriceComparisonChartProps {
  type: 'time' | 'distance';
}

export default function PriceComparisonChart({ type }: PriceComparisonChartProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const { cityBeeData, boltData } = generateChartData([], type);
    
    setChartData({
      datasets: [
        {
          label: 'CityBee',
          data: cityBeeData,
          backgroundColor: 'rgba(255, 99, 0, 0.6)',
          borderColor: 'rgb(255, 99, 0)',
          borderWidth: 1,
        },
        {
          label: 'Bolt',
          data: boltData,
          backgroundColor: 'rgba(75, 192, 0, 0.6)',
          borderColor: 'rgb(75, 192, 0)',
          borderWidth: 1,
        },
      ],
    });
  }, [type]);

  const options = {
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        title: {
          display: true,
          text: type === 'time' ? 'Time (minutes)' : 'Distance (km)',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Price (€)',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const point = context.raw;
            const label = context.dataset.label || '';
            return `${label}: ${point.name}, €${point.y.toFixed(2)}`;
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  if (!chartData) return <div className="flex h-[400px] items-center justify-center">Loading chart...</div>;

  return (
    <div className="h-[400px] w-full">
      <Scatter data={chartData} options={options} />
    </div>
  );
} 