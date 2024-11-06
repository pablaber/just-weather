import * as staticEnv from '$env/static/private';
import { z } from 'zod';

const LOG_LEVELS = ['error', 'warn', 'info', 'debug'] as const;
const ENVIRONMENTS = ['local', 'production'] as const;

const envSchema = z.object({
	// REQUIRED
	MAPBOX_ACCESS_TOKEN: z.string(),
	// OPTIONAL
	NO_CACHE: z
		.string()
		.transform((val) => val === 'true')
		.default('false'),

	// App Name
	APP_NAME: z.string().default('just-weather'),

	// Jail
	JAIL_THRESHOLD: z
		.string()
		.transform((val) => parseInt(val))
		.default('100'),

	// Logging
	LOG_LEVEL: z.enum(LOG_LEVELS).default('info'),

	// Axiom
	AXIOM_TOKEN: z.string().optional(),
	AXIOM_DATASET: z.string().optional(),

	// Environment
	ENVIRONMENT: z.enum(ENVIRONMENTS).default('local')
});

export const ENV = envSchema.parse(staticEnv);
