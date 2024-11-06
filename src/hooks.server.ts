import { customAlphabet } from 'nanoid';
import { ENV } from '$lib/config';
import { logger } from '$lib/utils/logger';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);

export async function handle({ event, resolve }) {
	const requestLogger = logger.child({
		reqId: nanoid()
	});
	requestLogger.info({
		method: event.request.method,
		path: event.url.pathname,
		query: event.url.search,
		message: 'request received'
	});
	event.locals.logger = requestLogger;
	return resolve(event);
}

const safeUrl = (url: string) => {
	return url.replace(ENV.MAPBOX_ACCESS_TOKEN, 'REDACTED');
};

export async function handleFetch({ request, fetch, event }) {
	const { logger } = event.locals;
	const basicRequestInfo = {
		url: safeUrl(request.url),
		method: request.method
	};
	logger.debug({ ...basicRequestInfo, type: 'fetch-start' }, 'external http');
	const start = Date.now();
	const response = await fetch(request);
	const end = Date.now();
	logger.info(
		{
			...basicRequestInfo,
			type: 'fetch-response',
			status: response.status,
			duration: end - start
		},
		'external http response'
	);
	return response;
}
