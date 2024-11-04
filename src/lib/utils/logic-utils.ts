import type { HourlyDataPoint } from '../types';

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
