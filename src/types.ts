export interface SoilData {
  ph: number;
  nitrogen: number;
  soc: number; // Soil Organic Carbon
  texture: string;
  sand: number;
  silt: number;
  clay: number;
  isEstimated?: boolean;
}

export interface ForecastDay {
  date: string;
  high: number;
  low: number;
  rainProb: number;
  description: string;
  icon: string;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  rain: number;
  description: string;
  icon: string;
  windSpeed: number;
  isEstimated?: boolean;
  forecast?: ForecastDay[];
}

export interface Crop {
  id: string;
  name: { [key: string]: string };
  minPh: number;
  maxPh: number;
  minTemp: number;
  maxTemp: number;
  waterRequirement: 'Low' | 'Medium' | 'High';
  sowingMonths: number[];
  description: { [key: string]: string };
  soilType: { [key: string]: string };
  rotationGroup: 'cereal' | 'legume' | 'oilseed' | 'vegetable' | 'fruit';
}

export interface Disease {
  id: string;
  name: { [key: string]: string };
  crop: string;
  symptoms: { [key: string]: string };
  treatment: { [key: string]: string };
  steps: { [key: string]: string[] };
  dosage: { [key: string]: string };
  application: { [key: string]: string };
  severity: 'Low' | 'Medium' | 'High';
}

export type Language = 'hi' | 'ta' | 'te' | 'mr' | 'bn' | 'gu' | 'kn' | 'en';

export interface AppState {
  language: Language;
  location: { lat: number; lng: number; name: string } | null;
  soil: SoilData | null;
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  isRefreshing?: boolean;
  previousCropId?: string;
}
