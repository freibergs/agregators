'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cityBeePackages, boltPackages, carGuruPackages, formatTime, formatPrice } from '../lib/data';
import { ChevronUp, ChevronDown, Info } from 'lucide-react';

const PROVIDER_STYLES: Record<string, { dot: string; text: string; border: string; badge: string }> = {
  CityBee: { dot: 'bg-orange-400', text: 'text-orange-400', border: 'border-l-orange-500/50', badge: 'bg-orange-500/15 text-orange-400' },
  Bolt: { dot: 'bg-green-400', text: 'text-green-400', border: 'border-l-green-500/50', badge: 'bg-green-500/15 text-green-400' },
  CarGuru: { dot: 'bg-blue-400', text: 'text-blue-400', border: 'border-l-blue-500/50', badge: 'bg-blue-500/15 text-blue-400' },
};

export default function PackageComparison() {
  const [selectedProviders, setSelectedProviders] = useState<Record<string, boolean>>({
    CityBee: true,
    Bolt: true,
    CarGuru: false,
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

  const handleProviderChange = (provider: string, checked: boolean) => {
    const selectedCount = Object.entries(selectedProviders).reduce((count, [key, value]) => {
      if (key === provider) return count + (checked ? 1 : 0);
      return count + (value ? 1 : 0);
    }, 0);

    if (selectedCount > 0) {
      setSelectedProviders((prev) => ({ ...prev, [provider]: checked }));
    }
  };

  const sortedPackages = useMemo(() => {
    const packages = [];
    if (selectedProviders.CityBee) packages.push(...cityBeePackages);
    if (selectedProviders.Bolt) packages.push(...boltPackages);
    if (selectedProviders.CarGuru) packages.push(...carGuruPackages);

    return packages.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'time') comparison = a.time - b.time;
      else if (sortBy === 'distance') comparison = a.distance - b.distance;
      else comparison = a.price - b.price;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [selectedProviders, sortBy, sortOrder]);

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
    );
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-zinc-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-white">Package Comparison</h2>
        <div className="flex gap-3">
          {Object.entries(PROVIDER_STYLES).map(([provider, style]) => (
            <button
              key={provider}
              onClick={() => handleProviderChange(provider, !selectedProviders[provider])}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                selectedProviders[provider]
                  ? `${style.badge} border-transparent`
                  : 'text-zinc-600 border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${selectedProviders[provider] ? style.dot : 'bg-zinc-700'}`} />
              {provider}{provider === 'CarGuru' ? '*' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800/50">
              <th className="px-6 py-3 text-left text-[10px] font-medium text-zinc-600 uppercase tracking-wider">
                Provider
              </th>
              {(['time', 'distance', 'price'] as const).map((field) => (
                <th
                  key={field}
                  onClick={() => handleSortChange(field)}
                  className="px-6 py-3 text-left text-[10px] font-medium text-zinc-600 uppercase tracking-wider cursor-pointer hover:text-zinc-400 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    {field}
                    <SortIcon field={field} />
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-[10px] font-medium text-zinc-600 uppercase tracking-wider">
                Package
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPackages.map((pkg, index) => {
              const style = PROVIDER_STYLES[pkg.provider];
              return (
                <motion.tr
                  key={`${pkg.provider}-${pkg.name}-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.01, duration: 0.2 }}
                  className={`table-row-hover border-l-2 ${style.border} border-b border-zinc-800/30`}
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                      <span className={`text-sm font-medium ${style.text}`}>{pkg.provider}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-zinc-400">{formatTime(pkg.time)}</td>
                  <td className="px-6 py-3 text-sm text-zinc-400">{pkg.distance} km</td>
                  <td className="px-6 py-3">
                    <span className="text-sm font-semibold text-zinc-200">€{formatPrice(pkg.price)}</span>
                  </td>
                  <td className="px-6 py-3 text-sm text-zinc-500">{pkg.name}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* CarGuru disclaimer */}
      {selectedProviders.CarGuru && (
        <div className="px-6 py-3 border-t border-zinc-800/50 flex items-start gap-2 bg-blue-500/5">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-400/80">
            CarGuru package prices are time bundles. Extra distance is charged separately using the standard per-km rate.
          </p>
        </div>
      )}
    </div>
  );
}
