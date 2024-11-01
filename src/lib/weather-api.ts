const openMeteoUrl = (path: string) =>  `https://api.open-meteo.com/v1${path}`;

type ForecastOptions = {
  latitude: number;
  longitude: number;
  hourly?: string[];
  current?: string[];
  temperature_unit?: string;
}

type StandardForecastResponse = {
  current_units?: {
    temperature_2m?: string;
    precipitation_probability?: string;
    wind_speed_10m?: string;
    weather_code?: string;
  }
  current?: {
    temperature_2m?: number;
    precipitation_probability?: number;
    wind_speed_10m?: number;
    weather_code?: number;
    is_day?: number;
  }
}

export async function forecast(options: ForecastOptions): Promise<StandardForecastResponse> {
  const baseUrl = openMeteoUrl('/forecast');
  const queryParams = new URLSearchParams({ latitude: options.latitude.toString(), longitude: options.longitude.toString() });
  if(options.hourly) {
    queryParams.set('hourly', options.hourly.join(','));
  }
  if(options.current) {
    queryParams.set('current', options.current.join(','));
  }
  if(options.temperature_unit) {
    queryParams.set('temperature_unit', options.temperature_unit);
  }
  const fullUrl = `${baseUrl}?${queryParams.toString()}`;

  const response = await fetch(fullUrl);
  return response.json();
}