import { Emitter } from '../../shared/event-emitter/event-emitter';

export interface GaragePageEvents {
  'garage:create-100': never;
  'race:completed': never;
  'race:start': never;
  'race:stop': never;
}

export const garageEmitter = new Emitter<GaragePageEvents>();
