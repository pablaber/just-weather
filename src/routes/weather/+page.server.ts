import { validateCoordinates } from '$lib/utils';
import { weatherApi } from '$lib';
import { redirect } from '@sveltejs/kit';
import { geocodingForPostCode, reverseGeocoding } from '$lib/mapbox-api.js';
import type { TemperatureUnit } from '$lib/types';

export async function load({ url, cookies }) {
  let latitude = url.searchParams.get('lat');
  let longitude = url.searchParams.get('lon');
  let locationName = '';

  const postcode = url.searchParams.get('postcode');

  const temperatureUnitRaw = cookies.get('temperature_unit');
  const temperatureUnit: TemperatureUnit = temperatureUnitRaw === 'fahrenheit' ? 'fahrenheit' : 'celsius';


  if (!postcode && (!latitude || !longitude)) {
    throw redirect(302, '/');
  }

  if(postcode) {
    const geocodingResponse  = await geocodingForPostCode(postcode);
    const { features: [firstFeature] } = geocodingResponse;
    if(!firstFeature) {
      throw redirect(302, `/?error=${encodeURIComponent('Postcode not found')}`);
    }
    latitude = firstFeature.properties.coordinates.latitude.toString();
    longitude = firstFeature.properties.coordinates.longitude.toString();
    locationName = firstFeature.properties.place_formatted;
  }

  if (!latitude || !longitude) {
    throw redirect(302, `/?error=${encodeURIComponent('Invalid coordinates')}`);
  }

  const validationResult = validateCoordinates(Number(latitude), Number(longitude));
  if (!validationResult.valid) {
    console.log(`Invalid coordinates: ${validationResult.error}`);
    throw redirect(302, '/');
  }

  if (!locationName) {
    const reverseGeocodingResponse = await reverseGeocoding(Number(latitude), Number(longitude), ['postcode']);
    const { features: [firstFeature] } = reverseGeocodingResponse;
    locationName = firstFeature?.properties.place_formatted;
  }

  const response = await weatherApi.forecast({
    latitude: Number(latitude),
    longitude: Number(longitude),
    current: ['temperature_2m', 'precipitation_probability', 'wind_speed_10m', 'weather_code', 'is_day'],
    temperature_unit: temperatureUnit,
  });

	return {
    forecast: response,
    location: {
      name: locationName,
    }
  };
}