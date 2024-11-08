import { customAlphabet } from 'nanoid';
import { ENV } from '$lib/config';
import { logger } from '$lib/utils/logger';
import { redirect } from '@sveltejs/kit';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);

export async function handle({ event, resolve }) {
	const requestLogger = logger.child({
		reqId: nanoid()
	});
	const userAgent = event.request.headers.get('user-agent') || 'unknown';
	requestLogger.info({
		type: 'app-request',
		method: event.request.method,
		path: event.url.pathname,
		query: event.url.search,
		userAgent
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

/**
 * Any unhandled error will go here.
 */
export async function handleError({ error, event, status }) {
	const { logger } = event.locals;

	let errorMessage = 'An unknown error occurred';
	if (error instanceof Error) {
		errorMessage = error.message;
	} else if (typeof error === 'string') {
		errorMessage = error;
	} else if (error && typeof error === 'object' && 'message' in error) {
		errorMessage = (error.message as string) || 'An unknown error occurred';
	}

	if (status === 404) {
		logger.debug({ type: '404-redirect', status, errorMessage });
		return redirect(302, '/');
	}

	logger.error({ type: 'unhandled-error', error: errorMessage, status });

	return {
		message: 'An unknown error occurred.'
	};
}