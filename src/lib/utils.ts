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
			error: 'Latitude must be between -90 and 90',
		};
	}

	if (longitude > 180 || longitude < -180) {
		return {
			valid: false,
			error: 'Longitude must be between -180 and 180',
		};
	}

	return {
		valid: true,
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
} {
	switch(weatherCode) {
		case 0:
			return { description: 'Clear sky', emoji: { day: '☀️', night: '🌙' } };
		case 1:
			return { description: 'Mainly clear', emoji: { day: '🌤️', night: '🌤️' } };
		case 2:
			return { description: 'Partly cloudy', emoji: { day: '⛅️', night: '⛅️' } };
		case 3:
			return { description: 'Overcast', emoji: { day: '☁️', night: '☁️' } };
		case 45:
			return { description: 'Fog', emoji: { day: '🌫️', night: '🌫️' } };
		case 48:
			return { description: 'Depositing rime fog', emoji: { day: '🌫️', night: '🌫️' } };
		case 51:
			return { description: 'Light drizzle', emoji: { day: '🌧️', night: '🌧️' } };
		case 53:
			return { description: 'Moderate drizzle', emoji: { day: '🌧️', night: '🌧️' } };
		case 55:
			return { description: 'Dense drizzle', emoji: { day: '🌧️', night: '🌧️' } };
		case 56:
			return { description: 'Light freezing drizzle', emoji: { day: '🌧️', night: '🌧️' } };
		case 57:
			return { description: 'Dense freezing drizzle', emoji: { day: '🌧️', night: '🌧️' } };
		case 61:
			return { description: 'Slight rain', emoji: { day: '🌧️', night: '🌧️' } };
		case 63:
			return { description: 'Moderate rain', emoji: { day: '🌧️', night: '🌧️' } };
		case 65:
			return { description: 'Heavy rain', emoji: { day: '🌧️', night: '🌧️' } };
		case 66:
			return { description: 'Light freezing rain', emoji: { day: '🌧️', night: '🌧️' } };
		case 67:
			return { description: 'Heavy freezing rain', emoji: { day: '🌧️', night: '🌧️' } };
		case 71:
			return { description: 'Slight snow fall', emoji: { day: '🌨️', night: '🌨️' } };
		case 73:
			return { description: 'Moderate snow fall', emoji: { day: '🌨️', night: '🌨️' } };
		case 75:
			return { description: 'Heavy snow fall', emoji: { day: '🌨️', night: '🌨️' } };
		case 77:
			return { description: 'Snow grains', emoji: { day: '🌨️', night: '🌨️' } };
		case 80:
			return { description: 'Slight rain showers', emoji: { day: '🌧️', night: '🌧️' } };
		case 81:
			return { description: 'Moderate rain showers', emoji: { day: '🌧️', night: '🌧️' } };
		case 82:
			return { description: 'Violent rain showers', emoji: { day: '🌧️', night: '🌧️' } };
		case 85:
			return { description: 'Slight snow showers', emoji: { day: '🌨️', night: '🌨️' } };
		case 86:
			return { description: 'Heavy snow showers', emoji: { day: '🌨️', night: '🌨️' } };
		case 95:
			return { description: 'Slight thunderstorm', emoji: { day: '⛈️', night: '⛈️' } };
		case 96:
			return { description: 'Thunderstorm with slight hail', emoji: { day: '⛈️', night: '⛈️' } };
		case 99:
			return { description: 'Thunderstorm with heavy hail', emoji: { day: '⛈️', night: '⛈️' } };
		default:
			return { description: 'Unknown', emoji: { day: '❓', night: '❓' } };
	}
}