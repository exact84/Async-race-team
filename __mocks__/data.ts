export const MOCK_SINGLE_CAR = { color: '#000000', id: 2, name: 'Ferrari' };

import type { WinnerWithCarData } from '../src/services/winners-service/types';

const MAX_COLOR = 0xff_ff_ff;
const MAX_VALUE = 100;
const HEX_RADIX = 16;

export const MOCK_CARS_ARRAY = [
  { color: 'red', id: 0, name: 'Tesla' },
  { color: 'black', id: 1, name: 'Aton Martin' },
  MOCK_SINGLE_CAR,
];

export const MOCK_SINGLE_WINNER_RECORD = { id: 2, time: 2, wins: 2 };

export const MOCK_WINNER_RECORDS_ARRAY = [
  { id: 0, time: 0, wins: 0 },
  { id: 1, time: 1, wins: 1 },
  MOCK_SINGLE_WINNER_RECORD,
];

export const MOCK_STARTED_ENGINE_METRICS = { distance: 100, velocity: 64 };
export const MOCK_STOPPED_ENGINE_METRICS = { distance: 100, velocity: 0 };

export const MOCK_SUCCESS_DRIVE_RESULT = { success: true };

export function generateWinners(count: number): WinnerWithCarData[] {
  return Array.from({ length: count }, (_, index) => ({
    color: `#${Math.floor(Math.random() * MAX_COLOR).toString(HEX_RADIX)}`,
    id: index + 1,
    name: `Car ${String(index + 1)}`,
    time: Math.floor(Math.random() * MAX_VALUE),
    wins: Math.floor(Math.random() * MAX_VALUE),
  }));
}
