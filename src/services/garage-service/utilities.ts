import type { Car } from './types';

import { getRandomHexColor, getRandomItem } from '../../shared/utilities';
import { CARS } from './constants';

export function createRandomCar(): Omit<Car, 'id'> {
  const { brand, models } = getRandomItem(CARS);
  const model = getRandomItem(models);
  const color = getRandomHexColor();

  return { color, name: `${brand} ${model}` };
}
