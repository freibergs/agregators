import { findBestPackage, type FindBestPackageResult, type Provider } from './data';

export interface TripFormValues {
  days: number;
  hours: number;
  minutes: number;
  distance: number;
  providers: Record<Provider, boolean>;
}

export interface TripScenario {
  formValues: TripFormValues;
  totalMinutes: number;
  distanceKm: number;
  selectedProviders: Provider[];
  hasTime: boolean;
  hasProviders: boolean;
  isValid: boolean;
  result: FindBestPackageResult | null;
}

export const DEFAULT_TRIP_FORM_VALUES: TripFormValues = {
  days: 0,
  hours: 0,
  minutes: 0,
  distance: 0,
  providers: {
    CityBee: true,
    Bolt: true,
    CarGuru: true,
  },
};

export const FALLBACK_TRIP_FORM_VALUES: TripFormValues = {
  ...DEFAULT_TRIP_FORM_VALUES,
  hours: 1,
  distance: 10,
};

export const buildTripScenario = (formValues: TripFormValues): TripScenario => {
  const safeFormValues: TripFormValues = {
    days: Math.max(0, formValues.days || 0),
    hours: Math.max(0, formValues.hours || 0),
    minutes: Math.max(0, formValues.minutes || 0),
    distance: Math.max(0, formValues.distance || 0),
    providers: {
      CityBee: Boolean(formValues.providers.CityBee),
      Bolt: Boolean(formValues.providers.Bolt),
      CarGuru: Boolean(formValues.providers.CarGuru),
    },
  };

  const totalMinutes =
    safeFormValues.days * 24 * 60 +
    safeFormValues.hours * 60 +
    safeFormValues.minutes;
  const selectedProviders = Object.entries(safeFormValues.providers)
    .filter(([, selected]) => selected)
    .map(([provider]) => provider as Provider);
  const hasTime = totalMinutes > 0;
  const hasProviders = selectedProviders.length > 0;
  const isValid = hasTime && hasProviders;

  return {
    formValues: safeFormValues,
    totalMinutes,
    distanceKm: safeFormValues.distance,
    selectedProviders,
    hasTime,
    hasProviders,
    isValid,
    result: isValid ? findBestPackage(totalMinutes, safeFormValues.distance, selectedProviders) : null,
  };
};
