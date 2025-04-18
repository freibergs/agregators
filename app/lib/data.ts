export interface Package {
  provider: 'CityBee' | 'Bolt' | 'CarGuru';
  time: number; // minutes
  distance: number; // kilometers
  price: number;
  name: string;
}

export interface StandardRate {
  provider: 'CityBee' | 'Bolt' | 'CarGuru';
  fixedFee: number;
  minuteRate: number;
  hourRate: number;
  dayRate: number;
  kmRate: number;
  minPrice: number;
}

// Standard rates
export const standardRates: StandardRate[] = [
  {
    provider: 'CityBee',
    fixedFee: 1.49,
    minuteRate: 0.12,
    hourRate: 5.49,
    dayRate: 19.99,
    kmRate: 0.29,
    minPrice: 2.99
  },
  {
    provider: 'Bolt',
    fixedFee: 0,
    minuteRate: 0.11,
    hourRate: 4.40,
    dayRate: 16.90,
    kmRate: 0.26,
    minPrice: 2.35
  },
  {
    provider: 'CarGuru',
    fixedFee: 0.99,
    minuteRate: 0.09,
    hourRate: 5.40, // Calculated from minute rate
    dayRate: 20.99,
    kmRate: 0.23,
    minPrice: 2.00
  }
];

// Predefined packages from CityBee
export const cityBeePackages: Package[] = [
  { provider: 'CityBee', time: 30, distance: 5, price: 5.29, name: '30min+5km' },
  { provider: 'CityBee', time: 30, distance: 10, price: 6.29, name: '30min+10km' },
  { provider: 'CityBee', time: 60, distance: 25, price: 12.09, name: '1h+25km' },
  { provider: 'CityBee', time: 120, distance: 20, price: 15.69, name: '2h+20km' },
  { provider: 'CityBee', time: 120, distance: 35, price: 19.69, name: '2h+35km' },
  { provider: 'CityBee', time: 120, distance: 45, price: 22.29, name: '2h+45km' },
  { provider: 'CityBee', time: 180, distance: 15, price: 19.69, name: '3h+15km' },
  { provider: 'CityBee', time: 180, distance: 30, price: 23.29, name: '3h+30km' },
  { provider: 'CityBee', time: 180, distance: 75, price: 34.89, name: '3h+75km' },
  { provider: 'CityBee', time: 240, distance: 40, price: 30.69, name: '4h+40km' },
  { provider: 'CityBee', time: 540, distance: 100, price: 44.29, name: '9h+100km' },
  { provider: 'CityBee', time: 540, distance: 250, price: 84.09, name: '9h+250km' },
  { provider: 'CityBee', time: 720, distance: 60, price: 34.69, name: '12h+60km' },
  { provider: 'CityBee', time: 720, distance: 150, price: 57.49, name: '12h+150km' },
  { provider: 'CityBee', time: 1440, distance: 25, price: 24.90, name: '1d+25km' },
  { provider: 'CityBee', time: 1440, distance: 75, price: 34.90, name: '1d+75km' },
  { provider: 'CityBee', time: 1440, distance: 100, price: 39.90, name: '1d+100km' },
  { provider: 'CityBee', time: 2880, distance: 50, price: 48.90, name: '2d+50km' },
  { provider: 'CityBee', time: 2880, distance: 100, price: 61.90, name: '2d+100km' },
  { provider: 'CityBee', time: 2880, distance: 250, price: 101.40, name: '2d+250km' },
  { provider: 'CityBee', time: 2880, distance: 400, price: 141.90, name: '2d+400km' },
  { provider: 'CityBee', time: 4320, distance: 100, price: 79.40, name: '3d+100km' },
  { provider: 'CityBee', time: 4320, distance: 175, price: 98.90, name: '3d+175km' },
  { provider: 'CityBee', time: 4320, distance: 200, price: 105.40, name: '3d+200km' },
  { provider: 'CityBee', time: 4320, distance: 300, price: 132.40, name: '3d+300km' },
  { provider: 'CityBee', time: 4320, distance: 500, price: 185.90, name: '3d+500km' },
  { provider: 'CityBee', time: 7200, distance: 150, price: 140.40, name: '5d+150km' },
  { provider: 'CityBee', time: 7200, distance: 250, price: 166.90, name: '5d+250km' },
  { provider: 'CityBee', time: 7200, distance: 450, price: 220.40, name: '5d+450km' },
  { provider: 'CityBee', time: 10080, distance: 200, price: 174.40, name: '7d+200km' },
  { provider: 'CityBee', time: 10080, distance: 400, price: 227.90, name: '7d+400km' },
  { provider: 'CityBee', time: 10080, distance: 600, price: 282.40, name: '7d+600km' },
  { provider: 'CityBee', time: 10080, distance: 900, price: 364.90, name: '7d+900km' },
  { provider: 'CityBee', time: 20160, distance: 600, price: 401.90, name: '14d+600km' },
  { provider: 'CityBee', time: 20160, distance: 1000, price: 511.90, name: '14d+1000km' },
  { provider: 'CityBee', time: 40320, distance: 1800, price: 973.40, name: '28d+1800km' },
  { provider: 'CityBee', time: 40320, distance: 2500, price: 1175.90, name: '28d+2500km' },
  // Special offers
  { provider: 'CityBee', time: 1440, distance: 50, price: 29.90, name: '1d+50km (special)' },
  { provider: 'CityBee', time: 60, distance: 10, price: 5.49, name: '1h+10km (special)' },
  { provider: 'CityBee', time: 2880, distance: 320, price: 99.00, name: '2d+320km (special)' },
];

// Predefined packages from Bolt
export const boltPackages: Package[] = [
  { provider: 'Bolt', time: 60, distance: 5, price: 5.59, name: '1h+5km' },
  { provider: 'Bolt', time: 60, distance: 10, price: 6.79, name: '1h+10km' },
  { provider: 'Bolt', time: 60, distance: 20, price: 9.09, name: '1h+20km' },
  { provider: 'Bolt', time: 60, distance: 30, price: 11.39, name: '1h+30km' },
  { provider: 'Bolt', time: 60, distance: 50, price: 16.09, name: '1h+50km' },
  { provider: 'Bolt', time: 120, distance: 10, price: 11.99, name: '2h+10km' },
  { provider: 'Bolt', time: 120, distance: 20, price: 13.49, name: '2h+20km' },
  { provider: 'Bolt', time: 120, distance: 30, price: 15.79, name: '2h+30km' },
  { provider: 'Bolt', time: 120, distance: 50, price: 20.49, name: '2h+50km' },
  { provider: 'Bolt', time: 120, distance: 75, price: 26.39, name: '2h+75km' },
  { provider: 'Bolt', time: 180, distance: 10, price: 15.59, name: '3h+10km' },
  { provider: 'Bolt', time: 180, distance: 20, price: 17.89, name: '3h+20km' },
  { provider: 'Bolt', time: 180, distance: 30, price: 20.29, name: '3h+30km' },
  { provider: 'Bolt', time: 180, distance: 50, price: 24.89, name: '3h+50km' },
  { provider: 'Bolt', time: 180, distance: 75, price: 30.79, name: '3h+75km' },
  { provider: 'Bolt', time: 180, distance: 100, price: 36.59, name: '3h+100km' },
  { provider: 'Bolt', time: 360, distance: 20, price: 21.69, name: '6h+20km' },
  { provider: 'Bolt', time: 360, distance: 30, price: 23.99, name: '6h+30km' },
  { provider: 'Bolt', time: 360, distance: 50, price: 28.69, name: '6h+50km' },
  { provider: 'Bolt', time: 360, distance: 75, price: 34.59, name: '6h+75km' },
  { provider: 'Bolt', time: 360, distance: 100, price: 40.39, name: '6h+100km' },
  { provider: 'Bolt', time: 360, distance: 150, price: 52.09, name: '6h+150km' },
  { provider: 'Bolt', time: 360, distance: 250, price: 75.49, name: '6h+250km' },
  { provider: 'Bolt', time: 360, distance: 500, price: 134, name: '6h+500km' },
  { provider: 'Bolt', time: 720, distance: 30, price: 23.99, name: '12h+30km' },
  { provider: 'Bolt', time: 720, distance: 50, price: 28.69, name: '12h+50km' },
  { provider: 'Bolt', time: 720, distance: 75, price: 34.59, name: '12h+75km' },
  { provider: 'Bolt', time: 720, distance: 100, price: 40.39, name: '12h+100km' },
  { provider: 'Bolt', time: 720, distance: 150, price: 52.09, name: '12h+150km' },
  { provider: 'Bolt', time: 720, distance: 250, price: 75.49, name: '12h+250km' },
  { provider: 'Bolt', time: 720, distance: 500, price: 134, name: '12h+500km' },
  { provider: 'Bolt', time: 1440, distance: 30, price: 23.99, name: '1d+30km' },
  { provider: 'Bolt', time: 1440, distance: 50, price: 28.69, name: '1d+50km' },
  { provider: 'Bolt', time: 1440, distance: 75, price: 34.59, name: '1d+75km' },
  { provider: 'Bolt', time: 1440, distance: 100, price: 40.39, name: '1d+100km' },
  { provider: 'Bolt', time: 1440, distance: 150, price: 52.09, name: '1d+150km' },
  { provider: 'Bolt', time: 1440, distance: 250, price: 75.49, name: '1d+250km' },
  { provider: 'Bolt', time: 1440, distance: 500, price: 134, name: '1d+500km' },
  { provider: 'Bolt', time: 1440, distance: 750, price: 192, name: '1d+750km' },
  { provider: 'Bolt', time: 2880, distance: 50, price: 45.69, name: '2d+50km' },
  { provider: 'Bolt', time: 2880, distance: 100, price: 57.39, name: '2d+100km' },
  { provider: 'Bolt', time: 2880, distance: 200, price: 80.79, name: '2d+200km' },
  { provider: 'Bolt', time: 2880, distance: 300, price: 104, name: '2d+300km' },
  { provider: 'Bolt', time: 2880, distance: 500, price: 151, name: '2d+500km' },
  { provider: 'Bolt', time: 2880, distance: 750, price: 209, name: '2d+750km' },
  { provider: 'Bolt', time: 2880, distance: 1000, price: 285, name: '2d+1000km' },
  { provider: 'Bolt', time: 4320, distance: 100, price: 74.39, name: '3d+100km' },
  { provider: 'Bolt', time: 4320, distance: 200, price: 97.79, name: '3d+200km' },
  { provider: 'Bolt', time: 4320, distance: 300, price: 121, name: '3d+300km' },
  { provider: 'Bolt', time: 4320, distance: 500, price: 168, name: '3d+500km' },
  { provider: 'Bolt', time: 4320, distance: 750, price: 226, name: '3d+750km' },
  { provider: 'Bolt', time: 4320, distance: 1000, price: 285, name: '3d+1000km' },
  { provider: 'Bolt', time: 4320, distance: 1500, price: 402, name: '3d+1500km' },
  { provider: 'Bolt', time: 10080, distance: 250, price: 178, name: '7d+250km' },
  { provider: 'Bolt', time: 10080, distance: 500, price: 236, name: '7d+500km' },
  { provider: 'Bolt', time: 10080, distance: 750, price: 295, name: '7d+750km' },
  { provider: 'Bolt', time: 10080, distance: 1000, price: 353, name: '7d+1000km' },
  { provider: 'Bolt', time: 10080, distance: 1500, price: 470, name: '7d+1500km' },
  { provider: 'Bolt', time: 10080, distance: 2000, price: 587, name: '7d+2000km' },
];

// Predefined packages from CarGuru (simulated for comparison)
export const carGuruPackages: Package[] = [
  // Short trips
  { provider: 'CarGuru', time: 60, distance: 10, price: 0.99 + (60 * 0.09) + (10 * 0.23), name: '1h+10km' },
  { provider: 'CarGuru', time: 120, distance: 20, price: 0.99 + (120 * 0.09) + (20 * 0.23), name: '2h+20km' },
  { provider: 'CarGuru', time: 180, distance: 30, price: 0.99 + (180 * 0.09) + (30 * 0.23), name: '3h+30km' },
  
  // Medium trips
  { provider: 'CarGuru', time: 360, distance: 50, price: 0.99 + (360 * 0.09) + (50 * 0.23), name: '6h+50km' },
  { provider: 'CarGuru', time: 720, distance: 100, price: 0.99 + (720 * 0.09) + (100 * 0.23), name: '12h+100km' },
  
  // Day trips (using day rate when cheaper)
  { provider: 'CarGuru', time: 1440, distance: 100, price: 0.99 + 20.99 + (100 * 0.23), name: '1d+100km' },
  { provider: 'CarGuru', time: 1440, distance: 200, price: 0.99 + 20.99 + (200 * 0.23), name: '1d+200km' },
  { provider: 'CarGuru', time: 2880, distance: 300, price: 0.99 + (2 * 20.99) + (300 * 0.23), name: '2d+300km' },
  { provider: 'CarGuru', time: 4320, distance: 500, price: 0.99 + (3 * 20.99) + (500 * 0.23), name: '3d+500km' },
  
  // Weekly trips
  { provider: 'CarGuru', time: 10080, distance: 750, price: 0.99 + (7 * 20.99) + (750 * 0.23), name: '7d+750km' },
  { provider: 'CarGuru', time: 10080, distance: 1000, price: 0.99 + (7 * 20.99) + (1000 * 0.23), name: '7d+1000km' },
];

// Note: These CarGuru packages are simulated for comparison purposes.
// CarGuru does not currently offer any predefined packages.

// All packages
export const allPackages = [...cityBeePackages, ...boltPackages, ...carGuruPackages];

// Calculate the price using the standard rate
export const calculateStandardPrice = (
  provider: 'CityBee' | 'Bolt' | 'CarGuru',
  timeInMinutes: number,
  distanceInKm: number
): number => {
  const rate = standardRates.find(r => r.provider === provider);
  if (!rate) return 0;

  // Calculate using minutes
  const totalByMinutes = timeInMinutes * rate.minuteRate;

  // Calculate using hours
  const totalHours = Math.floor(timeInMinutes / 60);
  const leftoverMinutes = timeInMinutes % 60;
  const totalByHours = (totalHours * rate.hourRate) + (leftoverMinutes * rate.minuteRate);

  // Calculate using days - check both current and next day
  const currentDays = Math.floor(timeInMinutes / 1440);
  const nextDays = currentDays + 1;
  
  // Current day calculation
  const remainingMinutes = timeInMinutes % 1440;
  const remainingHours = Math.floor(remainingMinutes / 60);
  const finalMinutes = remainingMinutes % 60;

  const currentDayPrice = currentDays * rate.dayRate;
  let remainingTimePrice = 0;
  
  if (remainingHours > 0) {
    const byHourPrice = remainingHours * rate.hourRate;
    const byMinutePrice = remainingHours * 60 * rate.minuteRate;
    remainingTimePrice += Math.min(byHourPrice, byMinutePrice);
  }
  remainingTimePrice += finalMinutes * rate.minuteRate;
  
  const currentDayTotal = currentDayPrice + remainingTimePrice;

  // Next day calculation (just use the full day rate)
  const nextDayTotal = nextDays * rate.dayRate;

  // Use the minimum of all calculation methods
  const timePrice = Math.min(
    totalByMinutes,
    totalByHours,
    currentDayTotal,
    nextDayTotal
  );

  const distancePrice = distanceInKm * rate.kmRate;
  const calculatedPrice = rate.fixedFee + timePrice + distancePrice;
  
  // Only use the calculated price if it's higher than minPrice
  return calculatedPrice > rate.minPrice ? calculatedPrice : rate.minPrice;
};

// Calculate extra charges for package overages
export const calculateExtraCharges = (
  provider: 'CityBee' | 'Bolt' | 'CarGuru',
  packageTime: number,
  packageDistance: number,
  actualTime: number,
  actualDistance: number
): number => {

  if (actualTime <= packageTime && actualDistance <= packageDistance) {
    return 0;
  }

  const rate = standardRates.find(r => r.provider === provider);
  if (!rate) return 0;

  let extraCharge = 0;

  // Calculate extra time charges
  if (actualTime > packageTime) {
    const extraMinutes = actualTime - packageTime;
    
    // Calculate using minutes
    const byMinutePrice = extraMinutes * rate.minuteRate;

    // Calculate using hours
    const totalHours = Math.floor(extraMinutes / 60);
    const leftoverMinutes = extraMinutes % 60;
    const byHourPrice = (totalHours * rate.hourRate) + (leftoverMinutes * rate.minuteRate);

    // Calculate using days
    const days = Math.floor(extraMinutes / 1440);
    const remainingMinutes = extraMinutes % 1440;
    const remainingHours = Math.floor(remainingMinutes / 60);
    const finalMinutes = remainingMinutes % 60;
    const byDayPrice = 
      (days * rate.dayRate) +
      (remainingHours * Math.min(rate.hourRate, remainingHours * 60 * rate.minuteRate)) +
      (finalMinutes * rate.minuteRate);

    const timeCharge = Math.min(byMinutePrice, byHourPrice, byDayPrice);
    extraCharge += timeCharge;
  }

  // Calculate extra distance charges
  if (actualDistance > packageDistance) {
    const extraDistance = actualDistance - packageDistance;
    const distanceCharge = extraDistance * rate.kmRate;
    extraCharge += distanceCharge;
  }

  return extraCharge;
};

type BestResult = 
  | {
      type: 'standard';
      provider: 'CityBee' | 'Bolt' | 'CarGuru';
      price: number;
      extraCharge: number;
    }
  | {
      type: 'package';
      provider: 'CityBee' | 'Bolt' | 'CarGuru';
      package: Package;
      price: number;
      extraCharge: number;
    };

// Find the best package for a given trip
export const findBestPackage = (
  timeInMinutes: number,
  distanceInKm: number,
  selectedProviders: ('CityBee' | 'Bolt' | 'CarGuru')[]
): { 
  bestOverall: BestResult;
  bestByProvider: {
    [key in 'CityBee' | 'Bolt' | 'CarGuru']?: {
      bestPackage: Package | null;
      bestStandard: number;
      totalPrice: number;
      extraCharge: number;
    };
  };
} => {

  // Calculate standard prices for selected providers
  const standardPrices = Object.fromEntries(
    selectedProviders.map(provider => [
      provider,
      calculateStandardPrice(provider, timeInMinutes, distanceInKm)
    ])
  ) as { [key in 'CityBee' | 'Bolt' | 'CarGuru']?: number };


  // Initialize best results for each provider
  // eslint-disable-next-line
  const bestByProvider: { [key: string]: any } = {};
  let bestOverallPrice = Infinity;
  let bestOverall: BestResult = {
    type: 'standard',
    provider: selectedProviders[0],
    price: Infinity,
    extraCharge: 0
  };

  // Find best standard price
  Object.entries(standardPrices).forEach(([provider, price]) => {
    if (price < bestOverallPrice) {
      bestOverallPrice = price;
      bestOverall = {
        type: 'standard',
        provider: provider as 'CityBee' | 'Bolt' | 'CarGuru',
        price: price,
        extraCharge: 0
      };
    }
  });

  // Process each provider separately
  selectedProviders.forEach(provider => {
    const standardPrice = standardPrices[provider] || Infinity;
    let bestProviderPackage: Package | null = null;
    let bestProviderPrice = standardPrice;
    let bestProviderExtraCharge = 0;

    // Filter packages for current provider
    const providerPackages = allPackages.filter(pkg => pkg.provider === provider);
    
    // Check each package for this provider
    providerPackages.forEach(pkg => {
      
      const extraCharge = calculateExtraCharges(
        provider,
        pkg.time,
        pkg.distance,
        timeInMinutes,
        distanceInKm
      );
      
      const totalPackagePrice = pkg.price + extraCharge;

      // Update best package for this provider
      if (totalPackagePrice < bestProviderPrice) {
        bestProviderPackage = pkg;
        bestProviderPrice = totalPackagePrice;
        bestProviderExtraCharge = extraCharge;
      }

      // Update overall best if this is better
      if (totalPackagePrice < bestOverallPrice) {
        bestOverallPrice = totalPackagePrice;
        bestOverall = {
          type: 'package',
          provider: provider,
          package: pkg,
          price: totalPackagePrice,
          extraCharge: extraCharge
        };
      }
    });

    // Store best results for this provider
    bestByProvider[provider] = {
      bestPackage: bestProviderPackage,
      bestStandard: standardPrice,
      totalPrice: Math.min(bestProviderPrice, standardPrice),
      extraCharge: bestProviderExtraCharge
    };
  });
  
  return {
    bestOverall,
    bestByProvider: bestByProvider as { [key in 'CityBee' | 'Bolt' | 'CarGuru']?: {
      bestPackage: Package | null;
      bestStandard: number;
      totalPrice: number;
      extraCharge: number;
    }}
  };
};

// Format price for display
export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

// Format time from minutes to readable format
export const formatTime = (minutes: number): string => {
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  
  let result = '';
  if (days > 0) result += `${days}d `;
  if (hours > 0) result += `${hours}h `;
  if (mins > 0) result += `${mins}min`;
  
  return result.trim();
};

// Generate data for comparison charts
export const generateChartData = (packages: Package[], property: 'time' | 'distance') => {
  const cityBeeData = cityBeePackages.map(pkg => ({
    x: pkg[property],
    y: pkg.price,
    r: property === 'time' ? pkg.distance / 10 : pkg.time / 60,
    name: pkg.name,
    time: pkg.time,
    distance: pkg.distance
  }));

  const boltData = boltPackages.map(pkg => ({
    x: pkg[property],
    y: pkg.price,
    r: property === 'time' ? pkg.distance / 10 : pkg.time / 60,
    name: pkg.name,
    time: pkg.time,
    distance: pkg.distance
  }));

  const carGuruData = carGuruPackages.map(pkg => ({
    x: pkg[property],
    y: pkg.price,
    r: property === 'time' ? pkg.distance / 10 : pkg.time / 60,
    name: pkg.name,
    time: pkg.time,
    distance: pkg.distance
  }));

  return {
    cityBeeData,
    boltData,
    carGuruData
  };
};

// Get maximum values from packages with 5% buffer
export const getMaxValues = () => {
  const maxTime = Math.max(...allPackages.map(pkg => pkg.time));
  const maxDistance = Math.max(...allPackages.map(pkg => pkg.distance));
  
  return {
    maxTime: Math.ceil(maxTime * 1.05), // Add 5% buffer
    maxDistance: Math.ceil(maxDistance * 1.05) // Add 5% buffer
  };
};

// Format time for axis labels
export const formatTimeAxisLabel = (minutes: number): string => {
  if (minutes < 60) return `${minutes}min`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
  return `${Math.floor(minutes / 1440)}d`;
};

// Generate points for standard pricing line
export const generateStandardPriceData = (property: 'time' | 'distance') => {
  const { maxTime, maxDistance } = getMaxValues();
  const maxValue = property === 'time' ? maxTime : maxDistance;

  const generatePoints = (provider: 'CityBee' | 'Bolt' | 'CarGuru') => {
    const points: Array<{x: number, y: number}> = [];
    const rate = standardRates.find(r => r.provider === provider);
    if (!rate) return points;

    if (property === 'time') {
      // Critical time points where rates might change
      const criticalPoints = [
        0,  // Start
        15, // Quarter hour
        30, // Half hour (potential hour rate transition)
        45, // Three quarters
        60, // One hour
        120, // 2 hours
        180, // 3 hours
        240, // 4 hours (potential day rate transition)
        300, // 5 hours
        360, // 6 hours
        720, // 12 hours
        1440, // 1 day
        2880, // 2 days
        4320, // 3 days
        maxValue // End point (max package time + 5%)
      ];

      // Add points at each critical time
      for (const x of criticalPoints) {
        if (x > maxValue) break;

        // For time graph, calculate all possible pricing methods
        const byMinutes = x * rate.minuteRate;
        
        // Hour calculation
        const fullHours = Math.floor(x / 60);
        const remainingMinutes = x % 60;
        let byHours;

        // If we have full hours, calculate their cost
        if (fullHours > 0) {
          byHours = fullHours * rate.hourRate;
          // Add remaining minutes at minute rate
          byHours += remainingMinutes * rate.minuteRate;
        } else {
          // For partial hours, compare minute rate vs hour rate
          byHours = Math.min(
            remainingMinutes * rate.minuteRate,
            rate.hourRate
          );
        }
        
        // Day calculation
        const fullDays = Math.floor(x / 1440);
        const remainingTime = x % 1440;
        const remainingHours = Math.ceil(remainingTime / 60);
        let byDays;

        if (fullDays > 0) {
          byDays = fullDays * rate.dayRate;
          // For remaining time, compare hour rate vs day rate
          if (remainingHours > 0) {
            byDays += Math.min(
              remainingHours * rate.hourRate,
              rate.dayRate
            );
          }
        } else {
          // For partial days, compare hour total vs day rate
          byDays = Math.min(
            remainingHours * rate.hourRate,
            rate.dayRate
          );
        }
        
        // Use the cheapest rate that doesn't make the price go down
        let basePrice;
        if (points.length > 1) {
          const lastPrice = points[points.length - 1].y;
          basePrice = Math.max(
            lastPrice - rate.fixedFee,
            Math.min(byMinutes, byHours, byDays)
          );
        } else {
          basePrice = Math.min(byMinutes, byHours, byDays);
        }

        // Add fixed fee and compare with minPrice
        const calculatedPrice = basePrice + rate.fixedFee;
        points.push({
          x,
          y: calculatedPrice > rate.minPrice ? calculatedPrice : rate.minPrice
        });
      }
    } else {
      // For distance, use fewer points with larger steps as distance increases
      const criticalPoints = [
        0, // Start
        5, // Short distance
        10,
        25,
        50, // Medium distance
        100,
        200,
        300,
        400,
        500, // Maximum distance
      ];

      // Add points at each critical distance
      for (const x of criticalPoints) {
        if (x > maxValue) break;
        
        const basePrice = x * rate.kmRate;
        const calculatedPrice = basePrice + rate.fixedFee;
        points.push({
          x,
          y: calculatedPrice > rate.minPrice ? calculatedPrice : rate.minPrice
        });
      }
    }

    return points;
  };

  return {
    cityBeeStandardLine: generatePoints('CityBee'),
    boltStandardLine: generatePoints('Bolt'),
    carGuruStandardLine: generatePoints('CarGuru')
  };
};
