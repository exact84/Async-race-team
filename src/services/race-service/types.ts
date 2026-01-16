import type { DriveMetrics } from '../engine-service/types';
import type { Car } from '../garage-service/types';

export type CarRaceParameters = CarCrashCallback & SignalOption & WinnerCallback;

export type CarWithDriveMetrics = Car & DriveMetrics;

export type RaceParameters = CarCrashCallback &
  RaceLifecycleCallbacks &
  SignalOption &
  WinnerCallback;

export interface SingleCarParameters extends SignalOption {
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
