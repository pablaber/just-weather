import { MAPBOX_ACCESS_TOKEN } from '$env/static/private';

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
	};
};

type GeocodingResponse = {
	features: MapboxFeature[];
};

export async function geocodingForPostCode(postCode: string): Promise<GeocodingResponse> {
	const geocodeForwardUrl = 'https://api.mapbox.com/search/geocode/v6/forward';
	const query = new URLSearchParams({
		access_token: MAPBOX_ACCESS_TOKEN,
		postcode: postCode
	});

	const response = await fetch(`${geocodeForwardUrl}?${query.toString()}`);
	return response.json();
}

export async function reverseGeocoding(
	latitude: number,
	longitude: number,
	types?: string[]
): Promise<GeocodingResponse> {
	const geocodeReverseUrl = 'https://api.mapbox.com/search/geocode/v6/reverse';
	const query = new URLSearchParams({
		access_token: MAPBOX_ACCESS_TOKEN,
		latitude: latitude.toString(),
		longitude: longitude.toString()
	});
	if (types) {
		query.append('types', types.join(','));
	}

	const response = await fetch(`${geocodeReverseUrl}?${query.toString()}`);
	return response.json();
}
