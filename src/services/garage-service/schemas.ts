import { z } from 'zod';

export const carSchema = z.object({ color: z.string(), id: z.number(), name: z.string() });

export const carsArraySchema = z.array(carSchema);
