import type { Car } from '../../services/garage-service/types';

import { Emitter } from '../../shared/event-emitter/event-emitter';

export interface GaragePageEvents {
  'garage:create-1': Omit<Car, 'id'>;
  'garage:create-100': never;
  'race:completed': never;
  'race:start': never;
  'race:stop': never;
}

export const garageEmitter = new Emitter<GaragePageEvents>();
