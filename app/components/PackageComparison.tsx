'use client';

import { useState } from 'react';
import { cityBeePackages, boltPackages, formatTime, formatPrice } from '../lib/data';

export default function PackageComparison() {
  const [filter, setFilter] = useState<string>('all');
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

  // Get packages based on filter
  const getFilteredPackages = () => {
    switch (filter) {
      case 'citybee':
        return [...cityBeePackages];
      case 'bolt':
        return [...boltPackages];
      default:
        return [...cityBeePackages, ...boltPackages];
    }
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
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'all' 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('citybee')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'citybee' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
              }`}
            >
              CityBee
            </button>
            <button 
              onClick={() => setFilter('bolt')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'bolt' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              Bolt
            </button>
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
                  ${pkg.provider === 'CityBee' ? 'border-l-4 border-orange-500' : 'border-l-4 border-green-500'}
                `}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        pkg.provider === 'CityBee' 
                          ? 'bg-orange-100 text-orange-600' 
                          : 'bg-green-100 text-green-600'
                      }`}
                    >
                      {pkg.provider === 'CityBee' ? 'CB' : 'B'}
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
    </div>
  );
} 