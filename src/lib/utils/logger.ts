import pino from 'pino';
import { ENV } from '$lib/config';

let axiomTransport;
if (ENV.AXIOM_TOKEN && ENV.AXIOM_DATASET) {
	axiomTransport = pino.transport({
		target: '@axiomhq/pino',
		options: {
			dataset: ENV.AXIOM_DATASET,
			token: ENV.AXIOM_TOKEN
		}
	});
}

export const logger = pino(
	{
		level: ENV.LOG_LEVEL,
		base: {
			app: ENV.APP_NAME,
			env: ENV.ENVIRONMENT,
			hostname: undefined,
			pid: undefined
		}
	},
	axiomTransport
);
