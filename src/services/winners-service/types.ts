import type { z } from 'zod';

import type { winnerRecordSchema } from './schemas';

export type SortField = 'id' | 'time' | 'wins';

export type SortOrder = 'ASC' | 'DESC';

export type WinnerRecord = z.infer<typeof winnerRecordSchema>;
