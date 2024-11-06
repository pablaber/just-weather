import { to } from 'await-to-js';
import { logicUtils, cookieUtils } from '$lib/utils';
import { weatherApi, mapboxApi } from '$lib/api';
import { redirect } from '@sveltejs/kit';
import { ENV } from '$lib/config';

type LocationDetails = {
	name: string;
	short: string;
};

export async function load({ url, cookies, setHeaders, locals, fetch }) {
	const { logger } = locals;
	let latitude = url.searchParams.get('lat');
	let longitude = url.searchParams.get('lon');
	const locationDetails: LocationDetails = {
		name: '',
		short: ''
	};

	const postcode = url.searchParams.get('postcode');

	const cookieMonster = cookieUtils.create(cookies);
	const jailCounter = cookieMonster.incrementJailCounter();
	const jailThreshold = ENV.JAIL_THRESHOLD;

	if (jailCounter >= jailThreshold) {
		logger.info({ jailCounter, jailThreshold }, 'Jail counter exceeded');
		throw redirect(302, '/jail');
	}

	const temperatureUnit = cookieMonster.getTemperatureUnit();

	if (!postcode && (!latitude || !longitude)) {
		logger.info('No coordinates or postcode provided');
		throw redirect(302, '/');
	}

	const mapbox = mapboxApi.create(fetch);
	const weather = weatherApi.create(fetch);

	if (postcode) {
		const [error, geocodingResponse] = await to(
			mapbox.geocodingForPostCode(postcode)
		);
		if (error) {
			logger.error({ error }, 'Error geocoding postcode');
			throw redirect(
				302,
				`/?error=${encodeURIComponent('Error geocoding postcode.')}`
			);
		}

		const {
			features: [firstFeature]
		} = geocodingResponse;
		if (!firstFeature) {
			throw redirect(
				302,
				`/?error=${encodeURIComponent('Postcode not found')}`
			);
		}

		const featureProperties = firstFeature.properties;
		latitude = featureProperties.coordinates.latitude.toString();
		longitude = featureProperties.coordinates.longitude.toString();
		locationDetails.name = featureProperties.place_formatted;

		const ctx = featureProperties.context;
		locationDetails.short =
			ctx.place?.name || ctx.district?.name || featureProperties.name;
	}

	if (!latitude || !longitude) {
		logger.info('Invalid coordinates');
		throw redirect(302, `/?error=${encodeURIComponent('Invalid coordinates')}`);
	}

	const validationResult = logicUtils.validateCoordinates(
		Number(latitude),
		Number(longitude)
	);
	if (!validationResult.valid) {
		logger.info(
			{ inputs: { latitude, longitude } },
			`Invalid coordinates: ${validationResult.error}`
		);
		throw redirect(302, '/');
	}

	if (!locationDetails.name) {
		const [error, reverseGeocodingResponse] = await to(
			mapbox.reverseGeocoding(Number(latitude), Number(longitude), ['postcode'])
		);
		if (error) {
			logger.error({ error }, 'Error reverse geocoding');
			throw redirect(
				302,
				`/?error=${encodeURIComponent('Error reverse geocoding.')}`
			);
		}
		const {
			features: [firstFeature]
		} = reverseGeocodingResponse;
		locationDetails.name = firstFeature?.properties.place_formatted;
		const ctx = firstFeature?.properties.context;
		locationDetails.short =
			ctx.place?.name || ctx.district?.name || firstFeature?.properties.name;
	}

	const [forecastError, forecast] = await to(
		weather.forecast({
			latitude: Number(latitude),
			longitude: Number(longitude),
			current: [
				'temperature_2m',
				'precipitation_probability',
				'wind_speed_10m',
				'weather_code',
				'is_day'
			],
			hourly: [
				'temperature_2m',
				'precipitation_probability',
				'weather_code',
				'is_day'
			],
			temperature_unit: temperatureUnit
		})
	);

	if (forecastError) {
		logger.error({ error: forecastError }, 'Error getting forecast');
		throw redirect(
			302,
			`/?error=${encodeURIComponent('Error getting forecast.')}`
		);
	}

	// Cache for 1 minute
	if (!ENV.NO_CACHE) {
		setHeaders({
			'cache-control': 'max-age=60'
		});
	}

	const hourlyData = logicUtils.rollupTimeData(forecast.hourly?.time ?? [], {
		temperature_2m: forecast.hourly?.temperature_2m ?? [],
		precipitation_probability: forecast.hourly?.precipitation_probability ?? [],
		weather_code: forecast.hourly?.weather_code ?? [],
		is_day: forecast.hourly?.is_day ?? []
	});

	return {
		forecast: {
			current: forecast.current,
			current_units: forecast.current_units,
			hourly: hourlyData,
			hourly_units: forecast.hourly_units
		},
		location: locationDetails
	};
}
