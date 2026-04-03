'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { findBestPackage, formatPrice, formatTime, standardRates } from '../lib/data';
import { Clock, MapPin, Trophy, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface FormInputs {
  days: number;
  hours: number;
  minutes: number;
  distance: number;
  providers: {
    [key: string]: boolean;
  };
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

const Calculator: React.FC = () => {
  const { control, handleSubmit, watch } = useForm<FormInputs>({
    defaultValues: {
      days: 0,
      hours: 0,
      minutes: 0,
      distance: 0,
      providers: { CityBee: true, Bolt: true, CarGuru: true },
    },
  });

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const [result, setResult] = React.useState<ReturnType<typeof findBestPackage> | null>(null);
  const [isCalculating, setIsCalculating] = React.useState(false);

  const onSubmit = async (data: FormInputs) => {
    setIsCalculating(true);
    const totalMinutes = data.days * 24 * 60 + data.hours * 60 + data.minutes;
    const selectedProviders = Object.entries(data.providers)
      .filter(([, selected]) => selected)
      .map(([provider]) => provider) as ('CityBee' | 'Bolt' | 'CarGuru')[];

    if (selectedProviders.length === 0) {
      alert('Please select at least one provider');
      setIsCalculating(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
    const calculationResult = findBestPackage(totalMinutes, data.distance, selectedProviders);
    setResult(calculationResult);
    setIsCalculating(false);
  };

  const providersData = [
    { id: 'CityBee', image: `${basePath}/citybee.png`, fullWidth: 400, fullHeight: 200 },
    { id: 'Bolt', image: `${basePath}/bolt.png`, fullWidth: 400, fullHeight: 200 },
    { id: 'CarGuru', image: `${basePath}/carguru.png`, fullWidth: 400, fullHeight: 200 },
  ];

  const watchAllFields = watch();
  const isValid =
    (watchAllFields.days > 0 || watchAllFields.hours > 0 || watchAllFields.minutes > 0) &&
    Object.values(watchAllFields.providers || {}).some((v) => v === true);

  return (
    <div className="max-w-2xl mx-auto glass-card p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Provider Selection */}
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

        {/* Time Inputs */}
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
                      type="number"
                      {...fieldProps}
                      onChange={(e) => fieldProps.onChange(Number(e.target.value))}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors text-center text-lg font-medium"
                      placeholder="0"
                      min="0"
                      max={field === 'hours' ? 23 : field === 'minutes' ? 59 : undefined}
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

        {/* Distance */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">Distance (km)</label>
          <Controller
            name="distance"
            control={control}
            rules={{ required: true, min: 0 }}
            render={({ field }) => (
              <div className="relative">
                <input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors text-lg font-medium"
                  placeholder="0"
                  min="0"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <MapPin className="w-4 h-4 text-zinc-600" />
                </div>
              </div>
            )}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isValid || isCalculating}
          className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 relative overflow-hidden ${
            isValid && !isCalculating
              ? 'bg-gradient-to-r from-orange-500 via-pink-500 to-blue-500 text-white hover:shadow-lg hover:shadow-orange-500/20 hover:scale-[1.01] active:scale-[0.99]'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          <span className={`transition-opacity duration-200 ${isCalculating ? 'opacity-0' : 'opacity-100'}`}>
            Calculate Best Price
          </span>
          {isCalculating && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
          )}
        </button>
      </form>

      {/* Results */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="mt-8 space-y-4"
          >
            {/* Best Overall Deal */}
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

            {/* Per-provider Results */}
            {Object.keys(result.bestByProvider).length > 1 && (
              <div
                className={`grid gap-3 ${
                  Object.keys(result.bestByProvider).length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                }`}
              >
                {Object.entries(result.bestByProvider).map(([provider, data]) => {
                  const colors = PROVIDER_COLORS[provider];
                  const isBest = data.totalPrice === result.bestOverall.price;
                  return (
                    <motion.div
                      key={provider}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className={`relative p-4 rounded-xl border group ${colors.border} ${colors.bg}`}
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
                            <p className="text-xs text-zinc-500">
                              {data.bestPackage.name}
                              <span className="ml-1 cursor-help text-zinc-600">i</span>
                            </p>
                            <div className="invisible group-hover:visible absolute z-20 w-64 p-3 glass-card border border-zinc-700/50 mt-1 text-xs">
                              <p className="font-semibold text-white mb-2">Package Details</p>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-zinc-500">Base Package</span>
                                  <span className="text-zinc-300">€{formatPrice(data.bestPackage.price)}</span>
                                </div>
                                {data.extraCharge > 0 && (
                                  <>
                                    <div className="border-t border-zinc-700/50 pt-2">
                                      <p className="text-zinc-400 font-medium mb-1">Extra Charges:</p>
                                      {data.bestPackage && (watchAllFields.hours * 60 + watchAllFields.minutes) > data.bestPackage.time && (
                                        <div className="flex justify-between text-zinc-500">
                                          <span>{formatTime((watchAllFields.hours * 60 + watchAllFields.minutes) - data.bestPackage.time)}</span>
                                          <span>€{(() => {
                                            const rate = standardRates.find(r => r.provider === data.bestPackage?.provider);
                                            return formatPrice(rate ? ((watchAllFields.hours * 60 + watchAllFields.minutes) - data.bestPackage!.time) * rate.minuteRate : 0);
                                          })()}</span>
                                        </div>
                                      )}
                                      {data.bestPackage && watchAllFields.distance > data.bestPackage.distance && (
                                        <div className="flex justify-between text-zinc-500">
                                          <span>{watchAllFields.distance - data.bestPackage.distance}km</span>
                                          <span>€{(() => {
                                            const rate = standardRates.find(r => r.provider === data.bestPackage?.provider);
                                            return formatPrice(rate ? (watchAllFields.distance - data.bestPackage!.distance) * rate.kmRate : 0);
                                          })()}</span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex justify-between font-medium border-t border-zinc-700/50 pt-1 text-zinc-300">
                                      <span>Total Extra</span>
                                      <span>€{formatPrice(data.extraCharge)}</span>
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
                          <p className="text-xs text-zinc-500">Standard Price</p>
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
