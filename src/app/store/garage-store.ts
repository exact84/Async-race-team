import { createStore } from '@ripetchor/ssm';

import type { Car } from '../../services/garage-service/types';

interface State {
  createCarFields: Car;
  currentPage: number;
  totalCount: number;
  updateCarFields: Record<number, Car | undefined>;
}

export const garageStore = createStore<State>({
  createCarFields: { color: '', id: Number.NaN, name: '' },
  currentPage: 1,
  totalCount: 0,
  updateCarFields: {},
});
