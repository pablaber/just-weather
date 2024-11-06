import { ENV } from '$lib/config';

type FeatureBase = {
	name: string;
	mapbox_id: string;
	wikidata_id: string;
};

/**
 * A feature returned from the Mapbox Geocoding API.
 * @see https://docs.mapbox.com/api/search/geocoding/#geocoding-response-object
 */
type MapboxFeature = {
	id: string;
	properties: {
		feature_type: string;
		full_address: string;
		mapbox_id: string;
		name: string;
		name_preferred: string;
		place_formatted: string;
		coordinates: {
			latitude: number;
			longitude: number;
		};
		context: {
			place?: FeatureBase;
			district?: FeatureBase;
			region?: FeatureBase;
			country?: FeatureBase;
		};
	};
};

/**
 * The response from the Mapbox Geocoding API.
 * @see https://docs.mapbox.com/api/search/geocoding/#geocoding-response-object
 */
type GeocodingResponse = {
	features: MapboxFeature[];
};

/**
 * Creates a new Mapbox API client. Used to pass in the SvelteKit fetch function.
 */
export function create(fetch: typeof globalThis.fetch) {
	return {
		/**
		 * Given a postcode, returns the features that match that postcode.
		 */
		geocodingForPostCode: async (postcode: string) => {
			const geocodeForwardUrl =
				'https://api.mapbox.com/search/geocode/v6/forward';
			const query = new URLSearchParams({
				access_token: ENV.MAPBOX_ACCESS_TOKEN,
				postcode: postcode
			});

			const response = await fetch(`${geocodeForwardUrl}?${query.toString()}`);
			return response.json() as Promise<GeocodingResponse>;
		},

		/**
		 * Will return all of the features that match the given latitude and longitude.
		 * Optionally, you can filter the types of features that are returned.
		 */
		reverseGeocoding: async (
			latitude: number,
			longitude: number,
			types?: string[]
		) => {
			const geocodeReverseUrl =
				'https://api.mapbox.com/search/geocode/v6/reverse';
			const query = new URLSearchParams({
				access_token: ENV.MAPBOX_ACCESS_TOKEN,
				latitude: latitude.toString(),
				longitude: longitude.toString()
			});
			if (types) {
				query.append('types', types.join(','));
			}

			const response = await fetch(`${geocodeReverseUrl}?${query.toString()}`);
			return response.json() as Promise<GeocodingResponse>;
		}
	};
}
