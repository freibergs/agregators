'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { findBestPackage, formatPrice, formatTime, standardRates } from '../lib/data';
import { FaClock, FaRoad } from 'react-icons/fa';
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

const Calculator: React.FC = () => {
  const { control, handleSubmit, watch } = useForm<FormInputs>({
    defaultValues: {
      days: 0,
      hours: 0,
      minutes: 0,
      distance: 0,
      providers: {
        CityBee: true,
        Bolt: true,
        CarGuru: true
      }
    }
  });

  const [result, setResult] = React.useState<ReturnType<typeof findBestPackage> | null>(null);
  const [isCalculating, setIsCalculating] = React.useState(false);

  const onSubmit = async (data: FormInputs) => {
    setIsCalculating(true);
    const totalMinutes = (data.days * 24 * 60) + (data.hours * 60) + data.minutes;
    const selectedProviders = Object.entries(data.providers)
      .filter(([, selected]) => selected)
      .map(([provider]) => provider) as ('CityBee' | 'Bolt' | 'CarGuru')[];

    if (selectedProviders.length === 0) {
      alert('Please select at least one provider');
      setIsCalculating(false);
      return;
    }

    // Add a small delay to show the calculation animation
    await new Promise(resolve => setTimeout(resolve, 600));
    const calculationResult = findBestPackage(totalMinutes, data.distance, selectedProviders);
    setResult(calculationResult);
    setIsCalculating(false);
  };

  const watchAllFields = watch();
  const isValid =
  (watchAllFields.days > 0 || watchAllFields.hours > 0 || watchAllFields.minutes > 0) &&
  Object.values(watchAllFields.providers || {}).some((v) => v === true);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Provider Selection */}
        <div className="space-y-2">
          <div className="flex gap-6 justify-center">
            {[
              { id: 'CityBee', image: '/citybee.png', fullWidth: 400, fullHeight: 200 },
              { id: 'Bolt', image: '/bolt.png', fullWidth: 400, fullHeight: 200 },
              { id: 'CarGuru', image: '/carguru.png', fullWidth: 400, fullHeight: 200 }
            ].map((provider) => (
              <div key={provider.id} className="flex items-center">
                <Controller
                  name={`providers.${provider.id}` as const}
                  control={control}
                  render={({ field: { value, ...field } }) => (
                    <label className="cursor-pointer group">
                      <input
                        type="checkbox"
                        {...field}
                        checked={Boolean(value)}
                        className="sr-only"
                      />
                      <div className={`relative p-3 transition-all rounded-lg ${
                        value 
                          ? 'scale-105' 
                          : 'hover:bg-gray-50/50'
                      }`}>
                        <div className="w-[60px] h-[30px] relative">
                          <Image
                            src={provider.image}
                            alt={provider.id}
                            fill
                            sizes="60px"
                            className={`transition-opacity object-contain ${
                              value ? 'opacity-100' : 'opacity-50 group-hover:opacity-75'
                            }`}
                            quality={100}
                            priority
                          />
                        </div>
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 ${
                          value 
                            ? 'border-blue-500 bg-white' 
                            : 'border-gray-300 bg-white'
                        }`}>
                          {value && (
                            <div className="absolute inset-0 m-0.5 rounded-full bg-blue-500" />
                          )}
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
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Days</label>
            <div className="mt-1 relative">
              <Controller
                name="days"
                control={control}
                rules={{ min: 0 }}
                render={({ field }) => (
                  <div className="flex items-center">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                        min="0"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <FaClock className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hours</label>
            <div className="mt-1 relative">
              <Controller
                name="hours"
                control={control}
                rules={{ min: 0, max: 23 }}
                render={({ field }) => (
                  <div className="flex items-center">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                        min="0"
                        max="23"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <FaClock className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Minutes</label>
            <div className="mt-1 relative">
              <Controller
                name="minutes"
                control={control}
                rules={{ min: 0, max: 59 }}
                render={({ field }) => (
                  <div className="flex items-center">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                        min="0"
                        max="59"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <FaClock className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        {/* Distance Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Distance (km)</label>
          <div className="mt-1 relative">
            <Controller
              name="distance"
              control={control}
              rules={{ required: true, min: 0 }}
              render={({ field }) => (
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                      min="0"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <FaRoad className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid || isCalculating}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            relative overflow-hidden transition-all duration-300
            ${isValid && !isCalculating ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}
          `}
        >
          <span className={`transition-opacity duration-300 ${isCalculating ? 'opacity-0' : 'opacity-100'}`}>
            Calculate Best Price
          </span>
          {isCalculating && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          )}
        </button>
      </form>

      {result && (
        <div className="mt-8 space-y-6 animate-fadeIn">
          {/* Best Overall Deal */}
          <div className={`p-4 rounded-lg border ${
            result.bestOverall.provider === 'CityBee' 
              ? 'bg-orange-50 border-orange-200' 
              : result.bestOverall.provider === 'Bolt'
                ? 'bg-green-50 border-green-200'
                : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${
                result.bestOverall.provider === 'CityBee'
                  ? 'text-orange-800'
                  : result.bestOverall.provider === 'Bolt'
                    ? 'text-green-800'
                    : 'text-blue-800'
              }`}>Best Deal 🏆</h3>
              <span className={`px-2 py-1 text-sm rounded ${
                result.bestOverall.provider === 'CityBee'
                  ? 'bg-orange-100 text-orange-800'
                  : result.bestOverall.provider === 'Bolt'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
              }`}>
                Save the most!
              </span>
            </div>
            <div className="mt-2">
              <p className={
                result.bestOverall.provider === 'CityBee'
                  ? 'text-orange-700'
                  : result.bestOverall.provider === 'Bolt'
                    ? 'text-green-700'
                    : 'text-blue-700'
              }>
                {result.bestOverall.type === 'package' ? (
                  <>
                    {result.bestOverall.package?.name} from {result.bestOverall.provider}
                    {result.bestOverall.extraCharge > 0 && (
                      <span className="text-sm"> (+ {formatPrice(result.bestOverall.extraCharge)}€ extra)</span>
                    )}
                  </>
                ) : (
                  <>Standard price from {result.bestOverall.provider}</>
                )}
              </p>
              <p className={`text-xl font-bold mt-1 ${
                result.bestOverall.provider === 'CityBee'
                  ? 'text-orange-800'
                  : result.bestOverall.provider === 'Bolt'
                    ? 'text-green-800'
                    : 'text-blue-800'
              }`}>
                {formatPrice(result.bestOverall.price)}€
              </p>
            </div>
          </div>

          {/* Provider-specific Results */}
          {Object.keys(result.bestByProvider).length > 1 && (
            <div className={`grid gap-4 ${
              Object.keys(result.bestByProvider).length === 2 ? 'grid-cols-2' : 'grid-cols-3'
            }`}>
              {Object.entries(result.bestByProvider).map(([provider, data]) => (
                <div key={provider} 
                  className={`p-4 rounded-lg border relative group ${
                    provider === 'CityBee'
                      ? 'bg-orange-50/50 border-orange-200'
                      : provider === 'Bolt'
                        ? 'bg-green-50/50 border-green-200'
                        : 'bg-blue-50/50 border-blue-200'
                  }`}
                >
                  <h3 className={`font-semibold ${
                    provider === 'CityBee'
                      ? 'text-orange-800'
                      : provider === 'Bolt'
                        ? 'text-green-800'
                        : 'text-blue-800'
                  }`}>{provider}</h3>
                  
                  {/* Best Package for Provider */}
                  {data.bestPackage ? (
                    <div className="mt-2">
                      <div className="relative">
                        <p className={`text-sm ${
                          provider === 'CityBee'
                            ? 'text-orange-600'
                            : provider === 'Bolt'
                              ? 'text-green-600'
                              : 'text-blue-600'
                        }`}>
                          {data.bestPackage.name}
                          <span className="ml-1 cursor-help">ℹ️</span>
                        </p>
                        {/* Updated Tooltip */}
                        <div className="invisible group-hover:visible absolute z-10 w-72 p-3 bg-white rounded-lg shadow-lg border mt-1 text-sm">
                          <p className="font-semibold mb-2">Package Details:</p>
                          <div className="space-y-3">
                            <div>
                              <p className="font-medium text-gray-700">Base Package:</p>
                              <p className="text-gray-600">{formatPrice(data.bestPackage.price)}€</p>
                            </div>

                            {data.extraCharge > 0 && (
                              <div>
                                <p className="font-medium text-gray-700 border-t pt-2">Extra Charges:</p>
                                <div className="ml-2 space-y-1 text-gray-600">
                                  {/* Calculate and show extra time */}
                                  {data.bestPackage && (watchAllFields.hours * 60 + watchAllFields.minutes) > data.bestPackage.time && (
                                    <div className="flex justify-between">
                                      <span>
                                        {formatTime((watchAllFields.hours * 60 + watchAllFields.minutes) - data.bestPackage.time)}:
                                      </span>
                                      <span>{(() => {
                                        const rate = standardRates.find(r => r.provider === data.bestPackage?.provider);
                                        return formatPrice(
                                          rate 
                                            ? ((watchAllFields.hours * 60 + watchAllFields.minutes) - data.bestPackage.time) * rate.minuteRate
                                            : 0
                                        );
                                      })()}€</span>
                                    </div>
                                  )}
                                  
                                  {/* Calculate and show extra distance */}
                                  {data.bestPackage && watchAllFields.distance > data.bestPackage.distance && (
                                    <div className="flex justify-between">
                                      <span>
                                        {watchAllFields.distance - data.bestPackage.distance}km:
                                      </span>
                                      <span>{(() => {
                                        const rate = standardRates.find(r => r.provider === data.bestPackage?.provider);
                                        return formatPrice(
                                          rate
                                            ? (watchAllFields.distance - data.bestPackage.distance) * rate.kmRate
                                            : 0
                                        );
                                      })()}€</span>
                                    </div>
                                  )}
                                  
                                  <div className="flex justify-between font-medium border-t mt-2 pt-1">
                                    <span>Total Extra:</span>
                                    <span>{formatPrice(data.extraCharge)}€</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className={`text-lg font-bold mt-1 ${
                        provider === 'CityBee'
                          ? 'text-orange-800'
                          : provider === 'Bolt'
                            ? 'text-green-800'
                            : 'text-blue-800'
                      }`}>
                        {formatPrice(data.bestPackage.price + data.extraCharge)}€
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Standard Price</p>
                      <p className={`text-lg font-bold ${
                        provider === 'CityBee'
                          ? 'text-orange-800'
                          : provider === 'Bolt'
                            ? 'text-green-800'
                            : 'text-blue-800'
                      }`}>
                        {formatPrice(data.bestStandard)}€
                      </p>
                    </div>
                  )}

                  {/* Best Option Indicator */}
                  {data.totalPrice === result.bestOverall.price && (
                    <div className="absolute -top-2 -right-2">
                      <span className="text-xl">🏆</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Calculator; 