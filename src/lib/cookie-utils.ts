import type { Cookies } from '@sveltejs/kit';
import { hoursToSeconds, addYears } from 'date-fns';
import type { TemperatureUnit } from './types';

const COOKIES = {
	JAIL: 'jail',
	TEMPERATURE_UNIT: 'temperature_unit'
};

type AdditionalCookieOptions = {
	maxAge?: number;
	expires?: Date;
};

function cookieOptions(additionalOptions: AdditionalCookieOptions = {}) {
	return {
		path: '/',
		httpOnly: true,
		...additionalOptions
	};
}

export function create(cookies: Cookies) {
	return {
		getJailCounter: () => parseInt(cookies.get(COOKIES.JAIL) || '0'),
		incrementJailCounter: () => {
			const currentCount = cookies.get(COOKIES.JAIL) || '0';
			const newCount = parseInt(currentCount) + 1;
			cookies.set(
				COOKIES.JAIL,
				newCount.toString(),
				cookieOptions({ maxAge: hoursToSeconds(1) })
			);
			return newCount;
		},
		getTemperatureUnit: () => {
			const temperatureUnitRaw = cookies.get(COOKIES.TEMPERATURE_UNIT);
			const temperatureUnit: TemperatureUnit =
				temperatureUnitRaw === 'fahrenheit' ? 'fahrenheit' : 'celsius';
			return temperatureUnit;
		},
		setTemperatureUnit: (temperatureUnit: TemperatureUnit) => {
			cookies.set(
				COOKIES.TEMPERATURE_UNIT,
				temperatureUnit,
				cookieOptions({
					expires: addYears(new Date(), 1)
				})
			);
		}
	};
}
