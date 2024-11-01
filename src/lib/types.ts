export type TemperatureUnit = 'celsius' | 'fahrenheit';

export type HourlyDataPoint = {
	time: string;
	temperature_2m: number;
	precipitation_probability: number;
	weather_code: number;
	is_day: number;
};
