import type { DriveMetrics } from '../engine-service/types';
import type { Car } from '../garage-service/types';

export type CarRaceCallbacks = CarCrashCallback & SignalOption & WinnerCallback;

export type CarWithDriveMetrics = Car & DriveMetrics;

export type RaceCallbacks = CarCrashCallback &
  RaceLifecycleCallbacks &
  SignalOption &
  WinnerCallback;

export interface SingleCarCallbacks extends SignalOption {
  onCrash(car: Car): void;
  onFinish(car: Car): void;
}

interface CarCrashCallback {
  onCarCrash(car: Car): void;
}

interface RaceLifecycleCallbacks {
  onRaceEnded(): void;
  onRaceStart(): void;
}

interface SignalOption {
  signal: AbortSignal;
}

interface WinnerCallback {
  onWinner(car: Car, time: number): void;
}
