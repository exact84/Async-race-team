import type { Car } from './types';

import { carsArraySchema, carSchema } from './schemas';

export function isCar(input: unknown): input is Car {
  return carSchema.safeParse(input).success;
}

export function isCarsArray(input: unknown): input is Car[] {
  return carsArraySchema.safeParse(input).success;
}
