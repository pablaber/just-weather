const openMeteoUrl = (path: string) => `https://api.open-meteo.com/v1${path}`;
const timeApiUrl = (path: string) =>
	`https://timeapi.io/api/time/current${path}`;

type ForecastOptions = {
	latitude: number;
	longitude: number;
	hourly?: string[];
	current?: string[];
	temperature_unit?: string;
	forecast_days?: number;
};

type StandardForecastResponse = {
	current_units?: {
		temperature_2m: string;
		precipitation_probability: string;
		wind_speed_10m: string;
		weather_code: string;
	};
	hourly_units?: {
		time: string;
		temperature_2m: string;
		precipitation_probability: string;
		weather_code: string;
		is_day: string;
	};
	current?: {
		temperature_2m: number;
		precipitation_probability: number;
		wind_speed_10m: number;
		weather_code: number;
		is_day: number;
	};
	hourly?: {
		time: string[];
		temperature_2m: number[];
		precipitation_probability: number[];
		weather_code: number[];
		is_day: number[];
	};
};

export function create(fetch: typeof globalThis.fetch) {
	async function timezoneForCoordinates(latitude: number, longitude: number) {
		const url = timeApiUrl('/coordinate');
		const queryParams = new URLSearchParams({
			latitude: latitude.toString(),
			longitude: longitude.toString()
		});
		const response = await fetch(`${url}?${queryParams.toString()}`);
		const data = await response.json();
		return data as { timeZone: string };
	}

	return {
		forecast: async (options: ForecastOptions) => {
			const { timeZone } = await timezoneForCoordinates(
				options.latitude,
				options.longitude
			);
			const baseUrl = openMeteoUrl('/forecast');
			const queryParams = new URLSearchParams({
				latitude: options.latitude.toString(),
				longitude: options.longitude.toString(),
				timezone: timeZone
			});
			if (options.hourly) {
				queryParams.set('hourly', options.hourly.join(','));
			}
			if (options.current) {
				queryParams.set('current', options.current.join(','));
			}
			if (options.temperature_unit) {
				queryParams.set('temperature_unit', options.temperature_unit);
			}
			if (options.forecast_days) {
				queryParams.set('forecast_days', options.forecast_days.toString());
			}
			const fullUrl = `${baseUrl}?${queryParams.toString()}`;

			const response = await fetch(fullUrl);
			return response.json() as Promise<StandardForecastResponse>;
		}
	};
}
