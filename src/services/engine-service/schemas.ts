import { z } from 'zod';

export const driveMetricsSchema = z.object({ distance: z.number(), velocity: z.number() });

export const driveResultSchema = z.object({ success: z.boolean() });
