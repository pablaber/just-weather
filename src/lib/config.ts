import * as staticEnv from '$env/static/private';
import { z } from 'zod';

const LOG_LEVELS = ['error', 'warn', 'info', 'debug'] as const;

const envSchema = z.object({
	// REQUIRED
	MAPBOX_ACCESS_TOKEN: z.string(),
	// OPTIONAL
	NO_CACHE: z
		.string()
		.transform((val) => val === 'true')
		.default('false'),
	JAIL_THRESHOLD: z
		.string()
		.transform((val) => parseInt(val))
		.default('100'),
	LOG_LEVEL: z.enum(LOG_LEVELS).default('info')
});

export const ENV = envSchema.parse(staticEnv);
