import type { z } from 'zod';

import type { driveMetricsSchema, driveResultSchema } from './schemas';

export type DriveMetrics = z.infer<typeof driveMetricsSchema>;

export type DriveResult = z.infer<typeof driveResultSchema>;

export type EngineStatus = 'started' | 'stopped';
