'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { findBestPackage, formatPrice, formatTime, Package } from '../lib/data';

interface CalculatorInputs {
  days: string;
  hours: string;
  minutes: string;
  distance: string;
}

export default function Calculator() {
  const [isValid, setIsValid] = useState(false);
  const [result, setResult] = useState<{
    bestPackage: Package | null;
    totalPrice: number;
    extraCharge: number;
    standardPrice: { citybee: number; bolt: number; carguru: number };
  } | null>(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CalculatorInputs>({
    defaultValues: {
      days: '',
      hours: '',
      minutes: '',
      distance: ''
    }
  });

  const days = watch('days');
  const hours = watch('hours');
  const minutes = watch('minutes');
  const distance = watch('distance');

  useEffect(() => {
    const daysNum = parseInt(days) || 0;
    const hoursNum = parseInt(hours) || 0;
    const minutesNum = parseInt(minutes) || 0;
    const distanceNum = parseFloat(distance) || 0;

    // Valid if we have distance AND any time value
    const hasTime = daysNum > 0 || hoursNum > 0 || minutesNum > 0;
    const hasDistance = distanceNum > 0;
    setIsValid(hasTime && hasDistance);
  }, [days, hours, minutes, distance]);

  const onSubmit: SubmitHandler<CalculatorInputs> = (data) => {
    const days = parseInt(data.days) || 0;
    const hours = parseInt(data.hours) || 0;
    const minutes = parseInt(data.minutes) || 0;
    const distance = parseFloat(data.distance) || 0;
    
    const totalMinutes = (days * 24 * 60) + (hours * 60) + minutes;
    
    if (totalMinutes <= 0 || distance <= 0) {
      return;
    }
    
    const result = findBestPackage(totalMinutes, distance);
    setResult(result);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-orange-500 to-green-500">
        <h2 className="text-3xl font-bold text-white text-center">Car Sharing Calculator</h2>
        <p className="text-white text-center mt-2">Compare CityBee, Bolt, and CarGuru prices</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Days</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              {...register('days', { min: 0 })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.days && <span className="text-red-500 text-sm">Please enter a valid number</span>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Hours</label>
            <input
              type="number"
              min="0"
              max="23"
              placeholder="0"
              {...register('hours', { min: 0, max: 23 })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.hours && <span className="text-red-500 text-sm">Please enter hours between 0-23</span>}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Minutes</label>
            <input
              type="number"
              min="0"
              max="59"
              placeholder="0"
              {...register('minutes', { min: 0, max: 59 })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.minutes && <span className="text-red-500 text-sm">Please enter minutes between 0-59</span>}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Distance (km)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              placeholder="0"
              {...register('distance', { min: 0 })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.distance && <span className="text-red-500 text-sm">Please enter a valid distance</span>}
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-3 rounded-lg font-bold text-lg transition duration-300 ${
              isValid 
                ? 'bg-gradient-to-r from-orange-500 to-green-500 text-white hover:opacity-90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Calculate Best Deal
          </button>
        </div>
      </form>
      
      {result && (
        <div className="p-6 bg-gray-50 border-t">
          <h3 className="text-2xl font-bold mb-4">Best Deal Found</h3>
          
          {result.bestPackage ? (
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                      result.bestPackage.provider === 'CityBee' 
                        ? 'bg-orange-100 text-orange-600' 
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {result.bestPackage.provider === 'CityBee' ? 'CB' : 'B'}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">
                      {result.bestPackage.provider} - {result.bestPackage.name}
                    </h4>
                    <p className="text-gray-500">
                      {formatTime(result.bestPackage.time)} / {result.bestPackage.distance} km
                    </p>
                  </div>
                </div>
                <div>
                  <span className="text-3xl font-bold text-green-600">€{formatPrice(result.totalPrice)}</span>
                </div>
              </div>
              
              {result.extraCharge > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-yellow-700">
                    <span className="font-bold">Note:</span> Package price €{formatPrice(result.bestPackage.price)} + 
                    extra charges €{formatPrice(result.extraCharge)} = €{formatPrice(result.totalPrice)}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg shadow border">
              <p className="text-gray-700">
                The best option is to use standard pricing.
              </p>
            </div>
          )}
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h4 className="text-lg font-bold text-orange-600 mb-2">CityBee Standard Price</h4>
              <p className="text-2xl font-bold">€{formatPrice(result.standardPrice.citybee)}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border">
              <h4 className="text-lg font-bold text-green-600 mb-2">Bolt Standard Price</h4>
              <p className="text-2xl font-bold">€{formatPrice(result.standardPrice.bolt)}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border">
              <h4 className="text-lg font-bold text-blue-600 mb-2">CarGuru Standard Price</h4>
              <p className="text-2xl font-bold">€{formatPrice(result.standardPrice.carguru)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 