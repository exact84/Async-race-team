import type { z } from 'zod';

import type { carSchema } from './schemas';

export type Car = z.infer<typeof carSchema>;
