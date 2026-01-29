import type { WinnerRecord } from './types';

import { winnerRecordsArraySchema, winnerRecordSchema } from './schemas';

export function isWinnerRecord(input: unknown): input is WinnerRecord {
  return winnerRecordSchema.safeParse(input).success;
}

export function isWinnerRecordsArray(input: unknown): input is WinnerRecord[] {
  return winnerRecordsArraySchema.safeParse(input).success;
}
