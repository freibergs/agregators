'use client';

import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Info, MapPin, Trophy } from 'lucide-react';
import Image from 'next/image';
import {
  formatPrice,
  formatTime,
  getExtraChargeBreakdown,
  type FindBestPackageResult,
  type Provider,
} from '../lib/data';
import { DEFAULT_TRIP_FORM_VALUES, type TripFormValues } from '../lib/trip';

interface CalculatorProps {
  defaultValues?: TripFormValues;
  result: FindBestPackageResult | null;
  showResult: boolean;
  onFormChange: (values: TripFormValues) => void;
}

const PROVIDER_COLORS: Record<string, { bg: string; border: string; text: string; glow: string; badge: string }> = {
  CityBee: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    glow: 'glow-orange',
    badge: 'bg-orange-500/20 text-orange-300',
  },
  Bolt: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    glow: 'glow-green',
    badge: 'bg-green-500/20 text-green-300',
  },
  CarGuru: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    glow: 'glow-blue',
    badge: 'bg-blue-500/20 text-blue-300',
  },
};

type PartialTripFormValues = Omit<Partial<TripFormValues>, 'providers'> & {
  providers?: Partial<Record<Provider, boolean>>;
};

const toTripFormValues = (values: PartialTripFormValues): TripFormValues => ({
  days: Number(values.days ?? DEFAULT_TRIP_FORM_VALUES.days),
  hours: Number(values.hours ?? DEFAULT_TRIP_FORM_VALUES.hours),
  minutes: Number(values.minutes ?? DEFAULT_TRIP_FORM_VALUES.minutes),
  distance: Number(values.distance ?? DEFAULT_TRIP_FORM_VALUES.distance),
  providers: {
    CityBee: Boolean(values.providers?.CityBee ?? DEFAULT_TRIP_FORM_VALUES.providers.CityBee),
    Bolt: Boolean(values.providers?.Bolt ?? DEFAULT_TRIP_FORM_VALUES.providers.Bolt),
    CarGuru: Boolean(values.providers?.CarGuru ?? DEFAULT_TRIP_FORM_VALUES.providers.CarGuru),
  },
});

const parseIntegerInput = (rawValue: string) => {
  const digitsOnly = rawValue.replace(/\D/g, '');
  if (!digitsOnly) {
    return 0;
  }

  return Number(digitsOnly.replace(/^0+(?=\d)/, ''));
};

const Calculator: React.FC<CalculatorProps> = ({
  defaultValues = DEFAULT_TRIP_FORM_VALUES,
  result,
  showResult,
  onFormChange,
}) => {
  const { control, handleSubmit, watch } = useForm<TripFormValues>({
    defaultValues,
  });

  React.useEffect(() => {
    const subscription = watch((values) => {
      onFormChange(toTripFormValues(values));
    });

    return () => subscription.unsubscribe();
  }, [onFormChange, watch]);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const providersData: Array<{ id: Provider; image: string; fullWidth: number; fullHeight: number }> = [
    { id: 'CityBee', image: `${basePath}/citybee.png`, fullWidth: 400, fullHeight: 200 },
    { id: 'Bolt', image: `${basePath}/bolt.png`, fullWidth: 400, fullHeight: 200 },
    { id: 'CarGuru', image: `${basePath}/carguru.png`, fullWidth: 400, fullHeight: 200 },
  ];

  const watchAllFields = toTripFormValues(watch());
  const currentTotalMinutes =
    watchAllFields.days * 24 * 60 +
    watchAllFields.hours * 60 +
    watchAllFields.minutes;
  const isValid =
    currentTotalMinutes > 0 &&
    Object.values(watchAllFields.providers || {}).some((value) => value === true);

  return (
    <div className="max-w-2xl mx-auto glass-card p-8">
      <form onSubmit={handleSubmit(() => undefined)} className="space-y-8">
        <div className="space-y-3">
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">Providers</label>
          <div className="flex gap-4 justify-center">
            {providersData.map((provider) => (
              <div key={provider.id}>
                <Controller
                  name={`providers.${provider.id}` as const}
                  control={control}
                  render={({ field: { value, ...field } }) => (
                    <label className="cursor-pointer group">
                      <input type="checkbox" {...field} checked={Boolean(value)} className="sr-only" />
                      <div
                        className={`relative px-5 py-3 rounded-xl border transition-all duration-200 ${
                          value
                            ? `${PROVIDER_COLORS[provider.id].border} ${PROVIDER_COLORS[provider.id].bg}`
                            : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
                        }`}
                      >
                        <div className="w-[60px] h-[28px] relative">
                          <Image
                            src={provider.image}
                            alt={provider.id}
                            fill
                            sizes="60px"
                            className={`transition-opacity object-contain ${
                              value ? 'opacity-100' : 'opacity-30 group-hover:opacity-50'
                            }`}
                            quality={100}
                            priority
                            unoptimized={true}
                          />
                        </div>
                        <div
                          className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 transition-colors ${
                            value ? 'border-zinc-600 bg-white' : 'border-zinc-700 bg-zinc-800'
                          }`}
                        >
                          {value && <div className="absolute inset-0 m-0.5 rounded-full bg-zinc-900" />}
                        </div>
                      </div>
                    </label>
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">Trip Duration</label>
          <div className="grid grid-cols-3 gap-3">
            {(['days', 'hours', 'minutes'] as const).map((field) => (
              <Controller
                key={field}
                name={field}
                control={control}
                rules={{ min: 0, ...(field === 'hours' ? { max: 23 } : field === 'minutes' ? { max: 59 } : {}) }}
                render={({ field: fieldProps }) => (
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      {...fieldProps}
                      value={String(fieldProps.value ?? 0)}
                      onChange={(event) => {
                        const parsedValue = parseIntegerInput(event.target.value);
                        const maxValue = field === 'hours' ? 23 : field === 'minutes' ? 59 : Number.MAX_SAFE_INTEGER;
                        fieldProps.onChange(Math.min(parsedValue, maxValue));
                      }}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors text-center text-lg font-medium"
                      placeholder="0"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-600" />
                    </div>
                    <span className="absolute -bottom-5 left-0 right-0 text-center text-[10px] text-zinc-600 uppercase tracking-wider">
                      {field}
                    </span>
                  </div>
                )}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">Distance (km)</label>
          <Controller
            name="distance"
            control={control}
            rules={{ required: true, min: 0 }}
            render={({ field }) => (
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  {...field}
                  value={String(field.value ?? 0)}
                  onChange={(event) => field.onChange(parseIntegerInput(event.target.value))}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors text-lg font-medium"
                  placeholder="0"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <MapPin className="w-4 h-4 text-zinc-600" />
                </div>
              </div>
            )}
          />
        </div>
      </form>

      <div className="mt-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/30 px-4 py-3">
        <p className="text-sm text-zinc-400">
          {isValid
            ? 'Prices and graphs update automatically while you type.'
            : 'Enter trip duration and keep at least one provider selected to see live results.'}
        </p>
        {watchAllFields.providers.CarGuru && (
          <p className="mt-2 text-xs text-zinc-500">
            CarGuru uses your distance to estimate driving time. The remaining duration is treated as waiting time.
          </p>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showResult && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="mt-8 space-y-4 relative z-40 overflow-visible"
          >
            <div
              className={`p-5 rounded-xl border ${
                PROVIDER_COLORS[result.bestOverall.provider].border
              } ${PROVIDER_COLORS[result.bestOverall.provider].bg} ${
                PROVIDER_COLORS[result.bestOverall.provider].glow
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className={`w-5 h-5 ${PROVIDER_COLORS[result.bestOverall.provider].text}`} />
                  <h3 className={`text-lg font-bold ${PROVIDER_COLORS[result.bestOverall.provider].text}`}>
                    Best Deal
                  </h3>
                </div>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${PROVIDER_COLORS[result.bestOverall.provider].badge}`}>
                  Cheapest option
                </span>
              </div>
              <div className="mt-3">
                <p className="text-zinc-400 text-sm">
                  {result.bestOverall.type === 'package' ? (
                    <>
                      {result.bestOverall.package?.name} from {result.bestOverall.provider}
                      {result.bestOverall.extraCharge > 0 && (
                        <span className="text-zinc-500"> (+€{formatPrice(result.bestOverall.extraCharge)} extra)</span>
                      )}
                    </>
                  ) : (
                    <>Standard price from {result.bestOverall.provider}</>
                  )}
                </p>
                <p className={`text-3xl font-bold mt-1 ${PROVIDER_COLORS[result.bestOverall.provider].text}`}>
                  €{formatPrice(result.bestOverall.price)}
                </p>
              </div>
            </div>

            {Object.keys(result.bestByProvider).length > 1 && (
              <div
                className={`grid gap-3 ${
                  Object.keys(result.bestByProvider).length === 2 ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-3'
                }`}
              >
                {Object.entries(result.bestByProvider).map(([provider, data]) => {
                  const colors = PROVIDER_COLORS[provider];
                  const isBest = data.totalPrice === result.bestOverall.price;
                  const extraBreakdown = data.bestPackage
                    ? getExtraChargeBreakdown(
                        data.bestPackage.provider,
                        data.bestPackage.time,
                        data.bestPackage.distance,
                        currentTotalMinutes,
                        watchAllFields.distance
                      )
                    : null;
                  return (
                    <motion.div
                      key={provider}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className={`relative p-4 rounded-xl border group overflow-visible ${colors.border} ${colors.bg}`}
                    >
                      {isBest && (
                        <div className="absolute -top-2 -right-2">
                          <Trophy className={`w-5 h-5 ${colors.text}`} />
                        </div>
                      )}
                      <h3 className={`font-semibold text-sm ${colors.text}`}>{provider}</h3>
                      {data.bestPackage ? (
                        <div className="mt-2">
                          <div className="relative">
                            <p className="text-xs text-zinc-500 inline-flex items-center gap-1">
                              {data.bestPackage.name}
                              <button
                                type="button"
                                className="inline-flex items-center justify-center text-zinc-500"
                                aria-label="Show package details"
                              >
                                <Info className="w-3.5 h-3.5" />
                              </button>
                            </p>
                            <div className="invisible pointer-events-none opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 absolute left-0 bottom-full mb-2 z-50 w-72 rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-xs shadow-2xl">
                              <p className="font-semibold text-white mb-2">Package Details</p>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-zinc-400">Base Package</span>
                                  <span className="text-zinc-200">€{formatPrice(data.bestPackage.price)}</span>
                                </div>
                                {extraBreakdown && extraBreakdown.total > 0 && (
                                  <>
                                    <div className="border-t border-zinc-700/50 pt-2">
                                      <p className="text-zinc-300 font-medium mb-1">Extra Charges:</p>
                                      {extraBreakdown.timeCharge > 0 && (
                                        <div className="flex justify-between text-zinc-400">
                                          <span>Time overage ({formatTime(Math.round(extraBreakdown.extraMinutes))})</span>
                                          <span>€{formatPrice(extraBreakdown.timeCharge)}</span>
                                        </div>
                                      )}
                                      {extraBreakdown.distanceCharge > 0 && (
                                        <div className="flex justify-between text-zinc-400">
                                          <span>{extraBreakdown.extraDistanceKm}km over distance</span>
                                          <span>€{formatPrice(extraBreakdown.distanceCharge)}</span>
                                        </div>
                                      )}
                                      {extraBreakdown.usesEstimatedDrivingWaitSplit && extraBreakdown.timeCharge > 0 && (
                                        <p className="mt-2 text-[11px] leading-relaxed text-zinc-600">
                                          Estimated CarGuru split: {formatTime(Math.round(extraBreakdown.estimatedDrivingMinutes)) || '0min'} driving
                                          {' + '}
                                          {formatTime(Math.round(extraBreakdown.estimatedWaitingMinutes)) || '0min'} waiting.
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex justify-between font-medium border-t border-zinc-700/50 pt-1 text-zinc-300">
                                      <span>Total Extra</span>
                                      <span>€{formatPrice(extraBreakdown.total)}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <p className={`text-xl font-bold mt-1 ${colors.text}`}>
                            €{formatPrice(data.bestPackage.price + data.extraCharge)}
                          </p>
                        </div>
                      ) : (
                        <div className="mt-2">
                          <div className="relative">
                            <p className="text-xs text-zinc-500 inline-flex items-center gap-1">
                              Standard Price
                              <button
                                type="button"
                                className="inline-flex items-center justify-center text-zinc-500"
                                aria-label="Show standard price details"
                              >
                                <Info className="w-3.5 h-3.5" />
                              </button>
                            </p>
                            <div className="invisible pointer-events-none opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 absolute left-0 bottom-full mb-2 z-50 w-72 rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-xs shadow-2xl">
                              <p className="font-semibold text-white mb-2">Standard Price Details</p>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-zinc-400">Type</span>
                                  <span className="text-zinc-200">No package used</span>
                                </div>
                                <div className="flex justify-between font-medium border-t border-zinc-700/50 pt-2 text-zinc-200">
                                  <span>Total</span>
                                  <span>€{formatPrice(data.bestStandard)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className={`text-xl font-bold ${colors.text}`}>€{formatPrice(data.bestStandard)}</p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calculator;
