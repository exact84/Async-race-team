import { z } from 'zod';

export const winnerRecordSchema = z.object({ id: z.number(), time: z.number(), wins: z.number() });

export const winnerRecordsArraySchema = z.array(winnerRecordSchema);
