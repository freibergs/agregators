'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ScatterController,
  TimeScale,
  CategoryScale,
  Title,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { generateChartData } from '../lib/data';
import { formatTime } from '../lib/data';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ScatterController,
  TimeScale,
  CategoryScale,
  Title
);

interface PriceComparisonChartProps {
  type: 'time' | 'distance';
}

export default function PriceComparisonChart({ type }: PriceComparisonChartProps) {
  const chartRef = useRef<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [zoomLoaded, setZoomLoaded] = useState(false);

  useEffect(() => {
    const loadZoomPlugin = async () => {
      const zoomPlugin = (await import('chartjs-plugin-zoom')).default;
      ChartJS.register(zoomPlugin);
      setZoomLoaded(true);
    };

    loadZoomPlugin();
  }, []);

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

  const maxX = type === 'time' ? 250 : 105;

  const options = {
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        min: 0,
        max: maxX,
        title: {
          display: true,
          text: type === 'time' ? 'Time (minutes)' : 'Distance (km)',
        },
        ticks: {
          callback: function (value: number) {
            return Math.round(value);
          },
          stepSize: 1,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Price (€)',
        },
        ticks: {
          callback: function (value: number) {
            return Math.round(value);
          },
          stepSize: 1,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const point = context.raw;
            const distance = point.distance ?? point.x ?? 0;
            const time = point.time ?? 0;
            const price = point.y ?? 0;
          
            return [
              `Distance: ${distance} km`,
              `Time: ${formatTime(time)}`,
              `Price: €${price.toFixed(2)}`
            ];
          }
        }
      },
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'xy',
          onZoom: ({ chart }) => {
            const x = chart.scales.x;
            const y = chart.scales.y;
    
            if (x.options.min !== 0) x.options.min = 0;
            if (y.options.min !== 0) y.options.min = 0;
    
            chart.update('none');
          }
        },
        pan: {
          enabled: false,
        },
        limits: {
          x: { min: 0 },
          y: { min: 0 },
        },
      },
    }
    ,
    responsive: true,
    maintainAspectRatio: false,
  };

  if (!zoomLoaded || !chartData) {
    return <div className="flex h-[400px] items-center justify-center">Loading chart...</div>;
  }

  return (
    <div
      className="h-[400px] w-full"
      onDoubleClick={() => {
        chartRef.current?.resetZoom();
      }}
      title="Scroll to zoom, double-click to reset"
    >
      <Scatter ref={chartRef} data={chartData} options={options} />
    </div>
  );
}
