import type { TemperatureUnit } from '$lib/types';
import { addYears } from 'date-fns';

export async function load({ cookies }) {
  const temperatureUnitRaw = cookies.get('temperature_unit');
  const temperatureUnit: TemperatureUnit = temperatureUnitRaw === 'fahrenheit' ? 'fahrenheit' : 'celsius';

  return {
    temperatureUnit,
  };
}

export const actions = {
  default: async ({ cookies, request }) => {
    const { temperatureUnit } = await request.json();
    if(temperatureUnit) {
      const temperatureUnitCookie: TemperatureUnit = temperatureUnit === 'fahrenheit' ? 'fahrenheit' : 'celsius';
      cookies.set('temperature_unit', temperatureUnitCookie, {
        path: '/',
        httpOnly: true,
        expires: addYears(new Date(), 1),
      });
    }
  },
};
