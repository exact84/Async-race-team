import type { Car } from './types';

import { getRandomHexColor, getRandomItem } from '../../shared/utilities';
import { CAR_BRANDS, CAR_MODELS } from './constants';

export function createRandomCar(): Omit<Car, 'id'> {
  const brand = getRandomItem(CAR_BRANDS);
  const model = getRandomItem(CAR_MODELS);
  const color = getRandomHexColor();

  return { color, name: `${brand} ${model}` };
}
