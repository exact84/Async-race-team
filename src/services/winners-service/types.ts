import type { z } from 'zod';

import type { winnerRecordSchema } from './schemas';

export interface GetAllOptions {
  limit?: number;
  order?: SortOrder;
  page?: number;
  signal?: AbortSignal;
  sort?: SortField;
}

export type SortField = 'id' | 'time' | 'wins';

export type SortOrder = 'ASC' | 'DESC';

export type WinnerRecord = z.infer<typeof winnerRecordSchema>;
