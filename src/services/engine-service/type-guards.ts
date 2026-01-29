import type { DriveMetrics, DriveResult } from './types';

import { driveMetricsSchema, driveResultSchema } from './schemas';

export function isDriveMetrics(input: unknown): input is DriveMetrics {
  return driveMetricsSchema.safeParse(input).success;
}

export function isDriveResult(input: unknown): input is DriveResult {
  return driveResultSchema.safeParse(input).success;
}
