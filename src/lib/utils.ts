import type { HourlyDataPoint } from './types';

type ValidateCoordinatesResult = {
	valid: boolean;
	error?: string;
};

/**
 * Validate the coordinates
 */
export function validateCoordinates(
	latitude: number,
	longitude: number
): ValidateCoordinatesResult {
	if (latitude > 90 || latitude < -90) {
		return {
			valid: false,
			error: 'Latitude must be between -90 and 90'
		};
	}

	if (longitude > 180 || longitude < -180) {
		return {
			valid: false,
			error: 'Longitude must be between -180 and 180'
		};
	}

	return {
		valid: true
	};
}

export function celsiusToFahrenheit(celsius: number): number {
	return celsius * 1.8 + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
	return (fahrenheit - 32) / 1.8;
}

export function weatherCodeInformation(weatherCode: number): {
	description: string;
	emoji: { day: string; night: string };
	icon: { day: string; night: string };
} {
	function dn(day: string, night: string) {
		return { day, night };
	}

	switch (weatherCode) {
		case 0:
			return {
				description: 'Clear sky',
				emoji: { day: '☀️', night: '🌙' },
				icon: dn('wi-day-sunny', 'wi-night-clear')
			};
		case 1:
			return {
				description: 'Mainly clear',
				emoji: { day: '🌤️', night: '🌤️' },
				icon: dn('wi-day-sunny-overcast', 'wi-night-alt-partly-cloudy')
			};
		case 2:
			return {
				description: 'Partly cloudy',
				emoji: { day: '⛅️', night: '⛅️' },
				icon: dn('wi-day-cloudy', 'wi-night-cloudy')
			};
		case 3:
			return {
				description: 'Overcast',
				emoji: { day: '☁️', night: '☁️' },
				icon: dn('wi-cloudy', 'wi-cloudy')
			};
		case 45:
			return {
				description: 'Fog',
				emoji: { day: '🌫️', night: '🌫️' },
				icon: dn('wi-day-fog', 'wi-night-fog')
			};
		case 48:
			return {
				description: 'Depositing rime fog',
				emoji: { day: '🌫️', night: '🌫️' },
				icon: dn('wi-day-fog', 'wi-night-fog')
			};
		case 51:
			return {
				description: 'Light drizzle',
				emoji: { day: '🌧️', night: '🌧️' },
				icon: dn('wi-showers', 'wi-showers')
			};
		case 53:
			return {
				description: 'Moderate drizzle',
				emoji: { day: '🌧️', night: '🌧️' },
				icon: dn('wi-rain', 'wi-rain')
			};
		case 55:
			return {
				description: 'Dense drizzle',
				emoji: { day: '🌧️', night: '🌧️' },
				icon: dn('wi-rain', 'wi-rain')
			};
		case 56:
			return {
				description: 'Light freezing drizzle',
				emoji: { day: '🌧️', night: '🌧️' },
				icon: dn('wi-rain-mix', 'wi-rain-mix')
			};
		case 57:
			return {
				description: 'Dense freezing drizzle',
				emoji: { day: '🌧️', night: '🌧️' },
				icon: dn('wi-rain-mix', 'wi-rain-mix')
			};
		case 61:
			return {
				description: 'Slight rain',
				emoji: { day: '🌧️', night: '🌧️' },
				icon: dn('wi-showers', 'wi-showers')
			};
		case 63:
			return {
				description: 'Moderate rain',
				emoji: { day: '🌧️', night: '🌧️' },
				icon: dn('wi-rain', 'wi-rain')
			};
		case 65:
			return {
				description: 'Heavy rain',
				emoji: { day: '🌧️', night: '🌧️' },
				icon: dn('wi-rain', 'wi-rain')
			};
		case 66:
			return {
				description: 'Light freezing rain',
				emoji: { day: '🌧️', night: '🌧️' },
				icon: dn('wi-rain-mix', 'wi-rain-mix')
			};
		case 67:
			return {
				description: 'Heavy freezing rain',
				emoji: { day: '🌧️', night: '🌧️' },
				icon: dn('wi-rain-mix', 'wi-rain-mix')
			};
		case 71:
			return {
				description: 'Slight snow fall',
				emoji: { day: '🌨️', night: '🌨️' },
				icon: dn('wi-snow', 'wi-snow')
			};
		case 73:
			return {
				description: 'Moderate snow fall',
				emoji: { day: '🌨️', night: '🌨️' },
				icon: dn('wi-snow', 'wi-snow')
			};
		case 75:
			return {
				description: 'Heavy snow fall',
				emoji: { day: '🌨️', night: '🌨️' },
				icon: dn('wi-snow', 'wi-snow')
			};
		case 77:
			return {
				description: 'Snow grains',
				emoji: { day: '🌨️', night: '🌨️' },
				icon: dn('wi-snow', 'wi-snow')
			};
		case 80:
			return {
				description: 'Slight rain showers',
				emoji: { day: '🌧️', night: '🌧️' },
				icon: dn('wi-showers', 'wi-showers')
			};
		case 81:
			return {
				description: 'Moderate rain showers',
				emoji: { day: '🌧️', night: '🌧️' },
				icon: dn('wi-showers', 'wi-showers')
			};
		case 82:
			return {
				description: 'Violent rain showers',
				emoji: { day: '🌧️', night: '🌧️' },
				icon: dn('wi-showers', 'wi-showers')
			};
		case 85:
			return {
				description: 'Slight snow showers',
				emoji: { day: '🌨️', night: '🌨️' },
				icon: dn('wi-snow', 'wi-snow')
			};
		case 86:
			return {
				description: 'Heavy snow showers',
				emoji: { day: '🌨️', night: '🌨️' },
				icon: dn('wi-snow', 'wi-snow')
			};
		case 95:
			return {
				description: 'Slight thunderstorm',
				emoji: { day: '⛈️', night: '⛈️' },
				icon: dn('wi-thunderstorm', 'wi-thunderstorm')
			};
		case 96:
			return {
				description: 'Thunderstorm with slight hail',
				emoji: { day: '⛈️', night: '⛈️' },
				icon: dn('wi-thunderstorm', 'wi-thunderstorm')
			};
		case 99:
			return {
				description: 'Thunderstorm with heavy hail',
				emoji: { day: '⛈️', night: '⛈️' },
				icon: dn('wi-thunderstorm', 'wi-thunderstorm')
			};
		default:
			return {
				description: 'Unknown',
				emoji: { day: '❓', night: '❓' },
				icon: dn('wi-na', 'wi-na')
			};
	}
}

export function rollupTimeData(time: string[], data: Record<string, number[]>) {
	return time.map((time, index) => {
		return {
			time,
			...Object.fromEntries(
				Object.entries(data).map(([key, value]) => [key, value[index]])
			)
		} as HourlyDataPoint;
	});
}
