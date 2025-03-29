export interface Package {
  provider: 'CityBee' | 'Bolt';
  time: number; // minutes
  distance: number; // kilometers
  price: number;
  name: string;
}

export interface StandardRate {
  provider: 'CityBee' | 'Bolt';
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

// All packages
export const allPackages = [...cityBeePackages, ...boltPackages];

// Calculate the price using the standard rate
export const calculateStandardPrice = (
  provider: 'CityBee' | 'Bolt',
  timeInMinutes: number,
  distanceInKm: number
): number => {
  const rate = standardRates.find(r => r.provider === provider);
  if (!rate) return 0;

  let timePrice = 0;
  const days = Math.floor(timeInMinutes / 1440);
  const remainingMinutes = timeInMinutes % 1440;
  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;

  if (days > 0) {
    timePrice += days * rate.dayRate;
  }

  if (hours > 0) {
    // Check if hourly rate is cheaper than minute rate
    const hourPrice = hours * rate.hourRate;
    const minutesPrice = hours * 60 * rate.minuteRate;
    timePrice += Math.min(hourPrice, minutesPrice);
  }

  timePrice += minutes * rate.minuteRate;
  
  const distancePrice = distanceInKm * rate.kmRate;
  const totalPrice = rate.fixedFee + timePrice + distancePrice;
  
  return Math.max(totalPrice, rate.minPrice);
};

// Calculate extra charges for package overages
export const calculateExtraCharges = (
  provider: 'CityBee' | 'Bolt',
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

  // Extra time charges
  if (actualTime > packageTime) {
    const extraMinutes = actualTime - packageTime;
    const extraDays = Math.floor(extraMinutes / 1440);
    const remainingExtraMinutes = extraMinutes % 1440;
    const extraHours = Math.floor(remainingExtraMinutes / 60);
    const extraMins = remainingExtraMinutes % 60;

    if (extraDays > 0) {
      extraCharge += extraDays * rate.dayRate;
    }

    if (extraHours > 0) {
      const hourPrice = extraHours * rate.hourRate;
      const minutesPrice = extraHours * 60 * rate.minuteRate;
      extraCharge += Math.min(hourPrice, minutesPrice);
    }

    extraCharge += extraMins * rate.minuteRate;
  }

  // Extra distance charges
  if (actualDistance > packageDistance) {
    extraCharge += (actualDistance - packageDistance) * rate.kmRate;
  }

  return extraCharge;
};

// Find the best package for a given trip
export const findBestPackage = (
  timeInMinutes: number,
  distanceInKm: number
): { 
  bestPackage: Package | null, 
  totalPrice: number, 
  extraCharge: number, 
  standardPrice: { citybee: number, bolt: number } 
} => {
  // Calculate standard prices
  const cityBeeStandardPrice = calculateStandardPrice('CityBee', timeInMinutes, distanceInKm);
  const boltStandardPrice = calculateStandardPrice('Bolt', timeInMinutes, distanceInKm);
  const standardPrices = { citybee: cityBeeStandardPrice, bolt: boltStandardPrice };

  // Start with standard pricing as the benchmark
  let bestPrice = Math.min(cityBeeStandardPrice, boltStandardPrice);
  let bestPackage: Package | null = null;
  let bestExtraCharge = 0;

  // Check each package
  allPackages.forEach(pkg => {
    const extraCharge = calculateExtraCharges(
      pkg.provider,
      pkg.time,
      pkg.distance,
      timeInMinutes,
      distanceInKm
    );
    
    const totalPackagePrice = pkg.price + extraCharge;
    
    if (totalPackagePrice < bestPrice) {
      bestPrice = totalPackagePrice;
      bestPackage = pkg;
      bestExtraCharge = extraCharge;
    }
  });

  return {
    bestPackage,
    totalPrice: bestPrice,
    extraCharge: bestExtraCharge,
    standardPrice: standardPrices
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

  return {
    cityBeeData,
    boltData
  };
};
