'use client';

import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  Brush,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  allPackages,
  calculateExtraCharges,
  findBestPackage,
  formatPrice,
  formatTime,
  type Provider,
} from '../lib/data';
import {
  buildTripScenario,
  FALLBACK_TRIP_FORM_VALUES,
  type TripScenario,
} from '../lib/trip';

type ChartAxis = 'time' | 'distance';

interface PriceComparisonChartProps {
  scenario: TripScenario;
}

interface TrendRow extends Partial<Record<Provider, number>> {
  x: number;
}

interface PackagePoint {
  x: number;
  y: number;
  provider: Provider;
  kind: 'package';
  name: string;
  basePrice: number;
  extraCharge: number;
  time: number;
  distance: number;
}

interface TripPoint {
  x: number;
  y: number;
  provider: Provider;
  kind: 'trip';
  isBest: boolean;
  packageName?: string;
  time: number;
  distance: number;
}

interface RankingEntry {
  provider: Provider;
  price: number;
  packageName?: string;
}

interface SwitchPoint {
  x: number;
  from: Provider;
  to: Provider;
}

const PROVIDERS: Provider[] = ['CityBee', 'Bolt', 'CarGuru'];

const PROVIDER_COLORS: Record<Provider, { stroke: string; fill: string; soft: string }> = {
  CityBee: { stroke: '#fb923c', fill: '#f97316', soft: 'rgba(249, 115, 22, 0.16)' },
  Bolt: { stroke: '#4ade80', fill: '#22c55e', soft: 'rgba(34, 197, 94, 0.16)' },
  CarGuru: { stroke: '#60a5fa', fill: '#3b82f6', soft: 'rgba(59, 130, 246, 0.16)' },
};
const MARKER_Y_OFFSET_PX = 12;

const roundTimeMax = (value: number) => {
  if (value <= 60) return Math.ceil(value / 5) * 5;
  if (value <= 180) return Math.ceil(value / 15) * 15;
  if (value <= 720) return Math.ceil(value / 30) * 30;
  if (value <= 1440) return Math.ceil(value / 60) * 60;
  if (value <= 4320) return Math.ceil(value / 240) * 240;
  if (value <= 10080) return Math.ceil(value / 720) * 720;
  return Math.ceil(value / 1440) * 1440;
};

const roundDistanceMax = (value: number) => {
  if (value <= 10) return Math.ceil(value / 1) * 1;
  if (value <= 50) return Math.ceil(value / 5) * 5;
  if (value <= 100) return Math.ceil(value / 10) * 10;
  if (value <= 300) return Math.ceil(value / 25) * 25;
  if (value <= 1000) return Math.ceil(value / 50) * 50;
  return Math.ceil(value / 100) * 100;
};

const getAxisStep = (axis: ChartAxis, maxValue: number) => {
  if (axis === 'time') {
    if (maxValue <= 60) return 5;
    if (maxValue <= 180) return 15;
    if (maxValue <= 720) return 30;
    if (maxValue <= 1440) return 60;
    if (maxValue <= 4320) return 240;
    if (maxValue <= 10080) return 720;
    return 1440;
  }

  if (maxValue <= 10) return 1;
  if (maxValue <= 50) return 5;
  if (maxValue <= 100) return 10;
  if (maxValue <= 300) return 25;
  if (maxValue <= 1000) return 50;
  return 100;
};

const formatAxisValue = (axis: ChartAxis, value: number) => {
  if (axis === 'time') {
    if (value < 60) return `${Math.round(value)} min`;
    if (value < 1440) return `${Math.round(value / 60)} h`;
    const days = Math.floor(value / 1440);
    const hours = Math.round((value % 1440) / 60);
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  }

  return `${Math.round(value)} km`;
};

const formatTickValue = (axis: ChartAxis, value: number) => {
  if (axis === 'time') {
    if (value < 60) return `${Math.round(value)}m`;
    if (value < 1440) return `${Math.round(value / 60)}h`;
    const days = value / 1440;
    return Number.isInteger(days) ? `${days}d` : `${days.toFixed(1)}d`;
  }

  return `${Math.round(value)}km`;
};

const getExampleScenario = (scenario: TripScenario) => {
  const hasAnyProvider = Object.values(scenario.formValues.providers).some(Boolean);

  return buildTripScenario({
    ...FALLBACK_TRIP_FORM_VALUES,
    providers: hasAnyProvider ? scenario.formValues.providers : FALLBACK_TRIP_FORM_VALUES.providers,
    distance: scenario.distanceKm > 0 ? scenario.distanceKm : FALLBACK_TRIP_FORM_VALUES.distance,
    days: scenario.hasTime ? scenario.formValues.days : FALLBACK_TRIP_FORM_VALUES.days,
    hours: scenario.hasTime ? scenario.formValues.hours : FALLBACK_TRIP_FORM_VALUES.hours,
    minutes: scenario.hasTime ? scenario.formValues.minutes : FALLBACK_TRIP_FORM_VALUES.minutes,
  });
};

const uniqueSorted = (values: number[]) => Array.from(new Set(values)).sort((a, b) => a - b);

const getDynamicMax = (axis: ChartAxis, currentValue: number, packageValues: number[]) => {
  const relevantPackageMax = Math.max(
    0,
    ...packageValues.filter((value) => value <= Math.max(currentValue * 1.5, currentValue + (axis === 'time' ? 360 : 100)))
  );
  const rawMax =
    axis === 'time'
      ? Math.max(currentValue * 1.15, relevantPackageMax, 180)
      : Math.max(currentValue * 1.2, relevantPackageMax, 25);

  return axis === 'time' ? roundTimeMax(rawMax) : roundDistanceMax(rawMax);
};

const buildAxisPoints = (axis: ChartAxis, maxValue: number, currentValue: number, packageValues: number[]) => {
  const step = getAxisStep(axis, maxValue);
  const values: number[] = [0, currentValue, maxValue];

  for (let point = 0; point <= maxValue; point += step) {
    values.push(point);
  }

  packageValues
    .filter((value) => value > 0 && value <= maxValue)
    .forEach((value) => values.push(value));

  if (axis === 'time') {
    [15, 30, 60, 120, 240, 720].forEach((offset) => {
      values.push(Math.max(0, currentValue - offset), currentValue + offset);
    });
  } else {
    [5, 10, 25, 50, 100].forEach((offset) => {
      values.push(Math.max(0, currentValue - offset), currentValue + offset);
    });
  }

  return uniqueSorted(values.filter((value) => value >= 0 && value <= maxValue));
};

const findProviderRows = (
  payload: Array<{ dataKey?: string; value?: number; color?: string }>
) =>
  payload
    .filter(
      (entry) =>
        typeof entry.value === 'number' &&
        typeof entry.dataKey === 'string' &&
        PROVIDERS.includes(entry.dataKey as Provider)
    )
    .map((entry) => ({
      provider: entry.dataKey as Provider,
      value: Number(entry.value),
      color: entry.color ?? PROVIDER_COLORS[entry.dataKey as Provider].stroke,
    }))
    .sort((a, b) => a.value - b.value);

const TripMarker = (props: { cx?: number; cy?: number; fill?: string; payload?: TripPoint }) => {
  if (props.cx === undefined || props.cy === undefined || !props.fill || !props.payload) {
    return null;
  }

  const radius = props.payload.isBest ? 8 : 6;
  const shiftedY = props.cy + MARKER_Y_OFFSET_PX;

  return (
    <g>
      <circle cx={props.cx} cy={shiftedY} r={radius + 4} fill={props.fill} opacity={0.18} />
      <circle cx={props.cx} cy={shiftedY} r={radius} fill="#0a0a0f" stroke={props.fill} strokeWidth={3} />
      <circle cx={props.cx} cy={shiftedY} r={2.5} fill={props.fill} />
    </g>
  );
};

const PackageMarker = (props: { cx?: number; cy?: number; fill?: string }) => {
  if (props.cx === undefined || props.cy === undefined) {
    return null;
  }

  const size = 5;
  const shiftedY = props.cy + MARKER_Y_OFFSET_PX;
  const fill = props.fill ?? '#a1a1aa';

  return (
    <path
      d={`M ${props.cx} ${shiftedY - size} L ${props.cx + size} ${shiftedY} L ${props.cx} ${shiftedY + size} L ${props.cx - size} ${shiftedY} Z`}
      fill={fill}
      opacity={0.9}
      stroke="#0a0a0f"
      strokeWidth={1.5}
    />
  );
};

const CustomTooltip = ({
  active,
  payload,
  axis,
}: {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    value?: number;
    color?: string;
    payload?: TrendRow | PackagePoint | TripPoint;
  }>;
  axis: ChartAxis;
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const firstPayload = payload[0]?.payload;

  if (firstPayload && 'kind' in firstPayload && firstPayload.kind === 'trip') {
    const point = firstPayload as TripPoint;
    return (
      <div className="glass-card px-4 py-3 border border-zinc-700/50 text-sm max-w-xs">
        <p className="font-semibold text-white mb-1">{point.provider}</p>
        <p className="text-zinc-400 mb-2">This ring shows your current trip.</p>
        <div className="space-y-0.5 text-zinc-400">
          <p>Time: {formatTime(point.time)}</p>
          <p>Distance: {point.distance} km</p>
          {point.packageName && <p>Cheapest package: {point.packageName}</p>}
          <p className="text-white font-medium">Total: €{formatPrice(point.y)}</p>
        </div>
      </div>
    );
  }

  if (firstPayload && 'kind' in firstPayload && firstPayload.kind === 'package') {
    const point = firstPayload as PackagePoint;
    return (
      <div className="glass-card px-4 py-3 border border-zinc-700/50 text-sm max-w-xs">
        <p className="font-semibold text-white mb-1">{point.provider} package</p>
        <p className="text-zinc-400 mb-2">
          {point.extraCharge > 0
            ? 'This package needs extra overage for the current fixed settings.'
            : 'This package lands here for the current fixed settings.'}
        </p>
        <div className="space-y-0.5 text-zinc-400">
          <p>Package: {point.name}</p>
          <p>Time: {formatTime(point.time)}</p>
          <p>Distance: {point.distance} km</p>
          <p>Base: €{formatPrice(point.basePrice)}</p>
          {point.extraCharge > 0 && <p>Extra: €{formatPrice(point.extraCharge)}</p>}
          <p className="text-white font-medium">Total: €{formatPrice(point.y)}</p>
        </div>
      </div>
    );
  }

  const rows = findProviderRows(payload);
  const xValue =
    firstPayload && 'x' in firstPayload && typeof firstPayload.x === 'number'
      ? firstPayload.x
      : 0;

  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="glass-card px-4 py-3 border border-zinc-700/50 text-sm max-w-xs">
      <p className="font-semibold text-white mb-1">{formatAxisValue(axis, xValue)}</p>
      <p className="text-zinc-400 mb-2">
        {rows[0].provider} is cheapest here, saving €{formatPrice((rows[1]?.value ?? rows[0].value) - rows[0].value)}.
      </p>
      <div className="space-y-1">
        {rows.map((row) => (
          <div key={row.provider} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: row.color }} />
              <span className="text-zinc-300 truncate">{row.provider}</span>
            </div>
            <span className="text-white font-medium">€{formatPrice(row.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function PriceComparisonChart({ scenario }: PriceComparisonChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [axis, setAxis] = useState<ChartAxis>('time');
  const [showPackages, setShowPackages] = useState(false);
  const [providerVisibility, setProviderVisibility] = useState<Record<Provider, boolean>>({
    CityBee: true,
    Bolt: true,
    CarGuru: true,
  });
  const [brushRange, setBrushRange] = useState({ startIndex: 0, endIndex: 0 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartScenario = scenario.isValid ? scenario : getExampleScenario(scenario);
  const deferredScenario = useDeferredValue(chartScenario);
  const availableProviders =
    deferredScenario.selectedProviders.length > 0 ? deferredScenario.selectedProviders : PROVIDERS;
  const showsCarGuru = availableProviders.includes('CarGuru');

  useEffect(() => {
    setProviderVisibility((current) => ({
      CityBee: availableProviders.includes('CityBee') ? current.CityBee : false,
      Bolt: availableProviders.includes('Bolt') ? current.Bolt : false,
      CarGuru: availableProviders.includes('CarGuru') ? current.CarGuru : false,
    }));
  }, [availableProviders]);

  const activeProviders = availableProviders.filter((provider) => providerVisibility[provider]);
  const visibleProviders = activeProviders.length > 0 ? activeProviders : availableProviders;
  const currentXValue = axis === 'time' ? deferredScenario.totalMinutes : deferredScenario.distanceKm;

  const chartData = useMemo(() => {
    const packageValues = allPackages
      .filter((pkg) => availableProviders.includes(pkg.provider))
      .map((pkg) => (axis === 'time' ? pkg.time : pkg.distance))
      .filter((value) => value > 0);
    const maxXValue = getDynamicMax(axis, currentXValue, packageValues);
    const axisPoints = buildAxisPoints(axis, maxXValue, currentXValue, packageValues);

    const trendRows = axisPoints.map<TrendRow>((xValue) => {
      const actualTime = axis === 'time' ? xValue : deferredScenario.totalMinutes;
      const actualDistance = axis === 'distance' ? xValue : deferredScenario.distanceKm;
      const result = findBestPackage(actualTime, actualDistance, availableProviders);
      const row: TrendRow = { x: xValue };

      availableProviders.forEach((provider) => {
        row[provider] = result.bestByProvider[provider]?.totalPrice;
      });

      return row;
    });

    const packagePoints = availableProviders.flatMap((provider) =>
      allPackages
        .filter((pkg) => pkg.provider === provider)
        .filter((pkg) => (axis === 'time' ? pkg.time : pkg.distance) > 0)
        .map<PackagePoint>((pkg) => {
          const actualTime = axis === 'time' ? pkg.time : deferredScenario.totalMinutes;
          const actualDistance = axis === 'distance' ? pkg.distance : deferredScenario.distanceKm;
          const extraCharge = calculateExtraCharges(provider, pkg.time, pkg.distance, actualTime, actualDistance);

          return {
            x: axis === 'time' ? pkg.time : pkg.distance,
            y: pkg.price + extraCharge,
            provider,
            kind: 'package',
            name: pkg.name,
            basePrice: pkg.price,
            extraCharge,
            time: actualTime,
            distance: actualDistance,
          };
        })
    );

    const ranking = availableProviders
      .map<RankingEntry | null>((provider) => {
        const providerEntry = deferredScenario.result?.bestByProvider[provider];
        if (!providerEntry) {
          return null;
        }

        return {
          provider,
          price: providerEntry.totalPrice,
          packageName: providerEntry.bestPackage?.name ?? undefined,
        };
      })
      .filter((entry): entry is RankingEntry => Boolean(entry))
      .sort((a, b) => a.price - b.price);

    const tripPoints = availableProviders
      .map<TripPoint | null>((provider) => {
        const providerEntry = deferredScenario.result?.bestByProvider[provider];
        if (!providerEntry) {
          return null;
        }

        return {
          x: currentXValue,
          y: providerEntry.totalPrice,
          provider,
          kind: 'trip',
          isBest: deferredScenario.result?.bestOverall.provider === provider,
          packageName: providerEntry.bestPackage?.name ?? undefined,
          time: deferredScenario.totalMinutes,
          distance: deferredScenario.distanceKm,
        };
      })
      .filter((entry): entry is TripPoint => Boolean(entry));

    return {
      axisPoints,
      maxXValue,
      trendRows,
      packagePoints,
      tripPoints,
      ranking,
    };
  }, [availableProviders, axis, currentXValue, deferredScenario]);

  useEffect(() => {
    setBrushRange({
      startIndex: 0,
      endIndex: Math.max(chartData.axisPoints.length - 1, 0),
    });
  }, [axis, chartData.axisPoints.length, currentXValue, deferredScenario.distanceKm, deferredScenario.totalMinutes]);

  const visibleRows = chartData.trendRows.slice(brushRange.startIndex, brushRange.endIndex + 1);
  const minVisibleX = visibleRows[0]?.x ?? 0;
  const maxVisibleX = visibleRows[visibleRows.length - 1]?.x ?? chartData.maxXValue;
  const tripIsVisible = currentXValue >= minVisibleX && currentXValue <= maxVisibleX;
  const visiblePackagePoints = chartData.packagePoints.filter(
    (point) =>
      point.x >= minVisibleX &&
      point.x <= maxVisibleX &&
      visibleProviders.includes(point.provider)
  );
  const visibleTripPoints = chartData.tripPoints.filter(
    (point) =>
      point.x >= minVisibleX &&
      point.x <= maxVisibleX &&
      visibleProviders.includes(point.provider)
  );

  const ranking = chartData.ranking.filter((entry) => visibleProviders.includes(entry.provider));
  const leader = ranking[0];
  const runnerUp = ranking[1];
  const bestProvider = deferredScenario.result?.bestOverall.provider;

  const switchPoints = useMemo<SwitchPoint[]>(() => {
    const points: SwitchPoint[] = [];
    let previousLeader: Provider | null = null;

    visibleRows.forEach((row) => {
      const currentLeader = visibleProviders
        .map((provider) => ({
          provider,
          price: row[provider] ?? Infinity,
        }))
        .sort((a, b) => a.price - b.price)[0];

      if (!currentLeader || !Number.isFinite(currentLeader.price)) {
        return;
      }

      if (previousLeader && previousLeader !== currentLeader.provider) {
        points.push({
          x: row.x,
          from: previousLeader,
          to: currentLeader.provider,
        });
      }

      previousLeader = currentLeader.provider;
    });

    return points.slice(0, 3);
  }, [visibleProviders, visibleRows]);

  const yValues = [
    ...chartData.trendRows.flatMap((row) =>
      visibleProviders
        .map((provider) => row[provider])
        .filter((value): value is number => typeof value === 'number' && Number.isFinite(value))
    ),
    ...chartData.tripPoints
      .filter((point) => visibleProviders.includes(point.provider) && point.provider === bestProvider)
      .map((point) => point.y),
    ...(showPackages
      ? chartData.packagePoints
          .filter((point) => visibleProviders.includes(point.provider))
          .map((point) => point.y)
      : []),
  ];
  const yMinRaw = yValues.length > 0 ? Math.min(...yValues) : 0;
  const yMaxRaw = yValues.length > 0 ? Math.max(...yValues) : 10;
  const ySpan = Math.max(1, yMaxRaw - yMinRaw);
  const yPadding = Math.max(12, ySpan * 0.24);
  const yDomain: [number, number] = [Math.max(0, yMinRaw - yPadding), yMaxRaw + yPadding];

  const zoomIsDefault =
    brushRange.startIndex === 0 &&
    brushRange.endIndex === Math.max(chartData.axisPoints.length - 1, 0);

  return (
    <div className="glass-card p-6 md:p-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              Live graph
            </span>
            {!scenario.isValid && (
              <span className="px-2.5 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-[11px] text-blue-300">
                Preview mode until you enter a valid trip
              </span>
            )}
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white">Price comparison graph</h2>
          <p className="text-sm md:text-base text-zinc-400 max-w-4xl">
            The lines show the cheapest total for each provider. The ring marks your current trip, and the graph
            automatically stretches around your numbers instead of using hardcoded ranges.
          </p>
          {showsCarGuru && (
            <p className="text-xs md:text-sm text-zinc-500 max-w-4xl">
              CarGuru is estimated from your distance and total duration: driving time is estimated first, and the
              rest is treated as waiting time.
            </p>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Current trip</p>
            <p className="mt-3 text-lg font-semibold text-white">{formatTime(deferredScenario.totalMinutes)}</p>
            <p className="text-sm text-zinc-400">{deferredScenario.distanceKm} km</p>
          </div>
          <div
            className="rounded-2xl border p-4"
            style={
              leader
                ? {
                    borderColor: `${PROVIDER_COLORS[leader.provider].stroke}44`,
                    backgroundColor: PROVIDER_COLORS[leader.provider].soft,
                  }
                : undefined
            }
          >
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Cheapest now</p>
            {leader ? (
              <>
                <p className="mt-3 text-lg font-semibold text-white">{leader.provider}</p>
                <p className="text-3xl font-bold text-white">€{formatPrice(leader.price)}</p>
                {leader.packageName && <p className="text-sm text-zinc-300">{leader.packageName}</p>}
              </>
            ) : (
              <p className="mt-3 text-sm text-zinc-400">Select at least one provider.</p>
            )}
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Gap to next option</p>
            {leader && runnerUp ? (
              <>
                <p className="mt-3 text-3xl font-bold text-white">€{formatPrice(runnerUp.price - leader.price)}</p>
                <p className="text-sm text-zinc-400">
                  {leader.provider} is ahead of {runnerUp.provider}
                </p>
              </>
            ) : (
              <p className="mt-3 text-sm text-zinc-400">No second provider is visible right now.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {(['time', 'distance'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAxis(value)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                  axis === value
                    ? 'border-zinc-700 bg-zinc-100 text-zinc-950'
                    : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                {value === 'time' ? 'Time view' : 'Distance view'}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setShowPackages((current) => !current)}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                showPackages
                  ? 'border-zinc-700 bg-zinc-800 text-white'
                  : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {showPackages ? 'Hide package points' : 'Show package points'}
            </button>

            <button
              type="button"
              onClick={() =>
                setBrushRange({
                  startIndex: 0,
                  endIndex: Math.max(chartData.axisPoints.length - 1, 0),
                })
              }
              disabled={zoomIsDefault}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                zoomIsDefault
                  ? 'border-zinc-800 bg-zinc-900/20 text-zinc-600 cursor-not-allowed'
                  : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              Reset zoom
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableProviders.map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => {
                  const count = availableProviders.filter((item) => providerVisibility[item]).length;
                  if (providerVisibility[provider] && count === 1) {
                    return;
                  }

                  setProviderVisibility((current) => ({
                    ...current,
                    [provider]: !current[provider],
                  }));
                }}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                  providerVisibility[provider]
                    ? 'text-white border-transparent'
                    : 'border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:border-zinc-700 hover:text-zinc-200'
                }`}
                style={
                  providerVisibility[provider]
                    ? {
                        backgroundColor: PROVIDER_COLORS[provider].soft,
                        boxShadow: `inset 0 0 0 1px ${PROVIDER_COLORS[provider].stroke}44`,
                      }
                    : undefined
                }
              >
                {provider}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-zinc-800/70 bg-zinc-950/35 p-4 md:p-5">
          <div className="h-[540px] md:h-[620px] w-full">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={360}>
                <ComposedChart data={chartData.trendRows} margin={{ top: 44, right: 24, bottom: 18, left: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" vertical={false} />
                  <XAxis
                    dataKey="x"
                    type="number"
                    domain={['dataMin', 'dataMax']}
                    tickFormatter={(value) => formatTickValue(axis, value)}
                    tick={{ fill: '#71717a', fontSize: 12 }}
                    axisLine={{ stroke: '#27272a' }}
                    tickLine={{ stroke: '#27272a' }}
                    minTickGap={36}
                  />
                  <YAxis
                    domain={yDomain}
                    tickFormatter={(value) => `€${Math.round(value)}`}
                    tick={{ fill: '#71717a', fontSize: 12 }}
                    axisLine={{ stroke: '#27272a' }}
                    tickLine={{ stroke: '#27272a' }}
                    width={74}
                  />
                  <Tooltip content={<CustomTooltip axis={axis} />} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeDasharray: '4 4' }} />

                  {tripIsVisible && (
                    <ReferenceLine
                      x={currentXValue}
                      stroke="rgba(255,255,255,0.14)"
                      strokeDasharray="5 5"
                      label={{
                        value: 'Your trip',
                        position: 'insideTopRight',
                        fill: '#a1a1aa',
                        fontSize: 12,
                      }}
                    />
                  )}

                  {visibleProviders.map((provider) => (
                    <Line
                      key={provider}
                      type="monotone"
                      dataKey={provider}
                      stroke={PROVIDER_COLORS[provider].stroke}
                      strokeWidth={3.5}
                      dot={false}
                      activeDot={{ r: 5, fill: PROVIDER_COLORS[provider].fill, stroke: '#0a0a0f', strokeWidth: 2 }}
                      connectNulls
                    />
                  ))}

                  {showPackages &&
                    visibleProviders.map((provider) => (
                      <Scatter
                        key={`${provider}-packages`}
                        data={visiblePackagePoints.filter((point) => point.provider === provider)}
                        fill={PROVIDER_COLORS[provider].fill}
                        shape={PackageMarker}
                      />
                    ))}

                  {visibleProviders.map((provider) => (
                    <Scatter
                      key={`${provider}-trip`}
                      data={visibleTripPoints.filter(
                        (point) => point.provider === provider && point.provider === bestProvider
                      )}
                      fill={PROVIDER_COLORS[provider].fill}
                      shape={TripMarker}
                    />
                  ))}

                  <Brush
                    dataKey="x"
                    height={28}
                    stroke="#3f3f46"
                    fill="rgba(39,39,42,0.55)"
                    travellerWidth={14}
                    startIndex={brushRange.startIndex}
                    endIndex={brushRange.endIndex}
                    tickFormatter={() => ''}
                    onChange={(range) => {
                      if (range?.startIndex === undefined || range?.endIndex === undefined) {
                        return;
                      }

                      setBrushRange({
                        startIndex: range.startIndex,
                        endIndex: range.endIndex,
                      });
                    }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full rounded-2xl border border-zinc-800/60 bg-zinc-950/50 animate-pulse" />
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-8 h-0.5 rounded-full bg-zinc-500" />
            <span>Each line is the cheapest total for that provider.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-zinc-300" />
            <span>Ring markers show your trip.</span>
          </div>
          {showPackages && (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rotate-45 border border-zinc-300 bg-zinc-300/20" />
              <span>Diamonds show package points.</span>
            </div>
          )}
          {!tripIsVisible && (
            <button
              type="button"
              onClick={() =>
                setBrushRange({
                  startIndex: 0,
                  endIndex: Math.max(chartData.axisPoints.length - 1, 0),
                })
              }
              className="text-blue-300 hover:text-blue-200 transition-colors"
            >
              Your trip is outside the current zoom. Bring it back into view.
            </button>
          )}
        </div>

        {switchPoints.length > 0 && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 px-4 py-3">
            <p className="text-sm text-zinc-400">
              Cheapest choice changes around{' '}
              {switchPoints.map((point, index) => (
                <span key={`${point.from}-${point.to}-${point.x}`}>
                  <span className="text-zinc-100">
                    {formatAxisValue(axis, point.x)} ({point.from} {'->'} {point.to})
                  </span>
                  {index < switchPoints.length - 1 ? ', ' : ''}
                </span>
              ))}
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
