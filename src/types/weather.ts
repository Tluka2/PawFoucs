export interface WeatherData {
  main: 'clear' | 'clouds' | 'rain' | 'thunderstorm' | 'snow' | 'mist';
  temp: number;
  description: string;
  icon: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  lastUpdate: string;
  cachedAt: number; // Timestamp for 30-min expiry
}
