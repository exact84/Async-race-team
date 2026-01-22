import type { Car } from '../../services/garage-service/types';

import { Emitter } from '../../shared/event-emitter/event-emitter';

export interface GaragePageEvents {
  'garage:create-hundred': never;
  'garage:create-one': Omit<Car, 'id'>;
  'garage:created-hundred': never;
  'garage:created-one': never;
  'garage:delete-car': never;
  'race:start': never;
  'race:stop': never;
}

export const garageEmitter = new Emitter<GaragePageEvents>();
