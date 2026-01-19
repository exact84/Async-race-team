import { Emitter } from '../../shared/event-emitter/event-emitter';

export interface GaragePageEvents {
  'race:completed': never;
  'race:start': never;
  'race:stop': never;
}

export const garageEmitter = new Emitter<GaragePageEvents>();
