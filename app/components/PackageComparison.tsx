'use client';

import { useState } from 'react';
import { cityBeePackages, boltPackages, carGuruPackages, formatTime, formatPrice } from '../lib/data';

export default function PackageComparison() {
  const [selectedProviders, setSelectedProviders] = useState<{
    CityBee: boolean;
    Bolt: boolean;
    CarGuru: boolean;
  }>({
    CityBee: true,
    Bolt: true,
    CarGuru: false
  });

  const [sortBy, setSortBy] = useState<'time' | 'distance' | 'price'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSortChange = (value: 'time' | 'distance' | 'price') => {
    if (sortBy === value) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(value);
      setSortOrder('asc');
    }
  };

  const handleProviderChange = (provider: 'CityBee' | 'Bolt' | 'CarGuru', checked: boolean) => {
    // Count how many would be selected after this change
    const selectedCount = Object.entries(selectedProviders).reduce((count, [key, value]) => {
      if (key === provider) {
        return count + (checked ? 1 : 0);
      }
      return count + (value ? 1 : 0);
    }, 0);

    // Only allow the change if it wouldn't result in all providers being deselected
    if (selectedCount > 0) {
      setSelectedProviders(prev => ({
        ...prev,
        [provider]: checked
      }));
    }
  };

  // Get packages based on selected providers
  const getFilteredPackages = () => {
    const packages = [];
    if (selectedProviders.CityBee) packages.push(...cityBeePackages);
    if (selectedProviders.Bolt) packages.push(...boltPackages);
    if (selectedProviders.CarGuru) packages.push(...carGuruPackages);
    return packages;
  };

  // Sort packages
  const getSortedPackages = () => {
    const filteredPackages = getFilteredPackages();
    
    return filteredPackages.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'time') {
        comparison = a.time - b.time;
      } else if (sortBy === 'distance') {
        comparison = a.distance - b.distance;
      } else if (sortBy === 'price') {
        comparison = a.price - b.price;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const sortedPackages = getSortedPackages();

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h2 className="text-2xl font-bold mb-4 sm:mb-0">Package Comparison</h2>
          
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-orange-500 rounded border-gray-300"
                checked={selectedProviders.CityBee}
                onChange={(e) => handleProviderChange('CityBee', e.target.checked)}
              />
              <span className="ml-2 text-orange-700 font-medium">CityBee</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-green-500 rounded border-gray-300"
                checked={selectedProviders.Bolt}
                onChange={(e) => handleProviderChange('Bolt', e.target.checked)}
              />
              <span className="ml-2 text-green-700 font-medium">Bolt</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-300"
                checked={selectedProviders.CarGuru}
                onChange={(e) => handleProviderChange('CarGuru', e.target.checked)}
              />
              <span className="ml-2 text-blue-700 font-medium">CarGuru</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Provider
              </th>
              <th 
                onClick={() => handleSortChange('time')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Time
                  {sortBy === 'time' && (
                    <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {sortOrder === 'asc' ? (
                        <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      ) : (
                        <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      )}
                    </svg>
                  )}
                </div>
              </th>
              <th 
                onClick={() => handleSortChange('distance')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Distance
                  {sortBy === 'distance' && (
                    <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {sortOrder === 'asc' ? (
                        <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      ) : (
                        <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      )}
                    </svg>
                  )}
                </div>
              </th>
              <th 
                onClick={() => handleSortChange('price')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Price
                  {sortBy === 'price' && (
                    <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {sortOrder === 'asc' ? (
                        <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      ) : (
                        <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      )}
                    </svg>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Package
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPackages.map((pkg, index) => (
              <tr 
                key={`${pkg.provider}-${pkg.name}-${index}`}
                className={`
                  hover:bg-gray-50
                  ${pkg.provider === 'CityBee' 
                    ? 'border-l-4 border-orange-500' 
                    : pkg.provider === 'Bolt'
                      ? 'border-l-4 border-green-500'
                      : 'border-l-4 border-blue-500'
                  }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        pkg.provider === 'CityBee' 
                          ? 'bg-orange-100 text-orange-600' 
                          : pkg.provider === 'Bolt'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {pkg.provider === 'CityBee' ? 'CB' : pkg.provider === 'Bolt' ? 'B' : 'CG'}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {pkg.provider}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatTime(pkg.time)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pkg.distance} km
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">€{formatPrice(pkg.price)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pkg.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProviders.CarGuru && (
        <div className="p-4 bg-blue-50 text-blue-700 text-sm">
          Note: CarGuru packages shown here are simulated for comparison purposes. CarGuru does not currently offer any predefined packages.
        </div>
      )}
    </div>
  );
} 