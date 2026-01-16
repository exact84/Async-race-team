import type { EngineService } from '../engine-service/engine.service';
import type { DriveMetrics } from '../engine-service/types';
import type { GarageService } from '../garage-service/garage.service';
import type { Car } from '../garage-service/types';
import type { WinnersService } from '../winners-service/winners.service';
import type {
  CarRaceCallbacks,
  CarWithDriveMetrics,
  RaceCallbacks,
  SingleCarCallbacks,
} from './types';

export class RaceService {
  private static instance: null | RaceService = null;

  private readonly engineService: EngineService;

  private readonly garageService: GarageService;

  private startedEngines = new Set<number>();

  private winnerDeclared = false;

  private readonly winnersService: WinnersService;

  private constructor(
    garageService: GarageService,
    engineService: EngineService,
    winnersService: WinnersService
  ) {
    this.garageService = garageService;
    this.engineService = engineService;
    this.winnersService = winnersService;
  }

  public static getInstance(
    garageService: GarageService,
    engineService: EngineService,
    winnersService: WinnersService
  ): RaceService {
    this.instance ??= new RaceService(garageService, engineService, winnersService);

    return this.instance;
  }

  public startCarSingle(car: Car, callbacks: SingleCarCallbacks): void {
    const { signal } = callbacks;

    this.startEngine(car, signal)
      .then(() => this.engineService.drive(car.id, signal))
      .then(
        () => {
          callbacks.onFinish(car);
        },
        () => {
          callbacks.onCrash(car);
        }
      );
  }

  public startRace(callbacks: RaceCallbacks): Promise<void> {
    this.winnerDeclared = false;

    const { signal } = callbacks;

    callbacks.onRaceStart();

    return this.garageService
      .getAll({ signal })
      .then((cars) => Promise.all(this.startAllEngines(cars, signal)))
      .then((engines) => this.driveAllCars(engines, callbacks))
      .then(() => {
        callbacks.onRaceEnded();
      });
  }

  public stopEngine(carId: number): Promise<DriveMetrics> {
    return this.engineService
      .toggle(carId, 'stopped')
      .finally(() => this.startedEngines.delete(carId));
  }

  public stopRace(): void {
    this.winnerDeclared = false;

    this.stopAllEngines().then(console.warn, console.error);
  }

  private driveAllCars(
    engines: CarWithDriveMetrics[],
    callbacks: CarRaceCallbacks
  ): Promise<PromiseSettledResult<void>[]> {
    const promises = engines.map((engine) => this.startCarRace(engine, callbacks));

    return Promise.allSettled(promises);
  }

  private startAllEngines(cars: Car[], signal: AbortSignal): Promise<CarWithDriveMetrics>[] {
    const stopPromise = this.stopAllEngines();

    return cars.map((car) => stopPromise.then(() => this.startEngine(car, signal)));
  }

  private startCarRace(car: Car, callbacks: CarRaceCallbacks): Promise<void> {
    const { signal } = callbacks;

    const start = Date.now();

    return this.engineService.drive(car.id, signal).then(
      () => {
        if (!this.winnerDeclared) {
          const end = Date.now() - start;

          callbacks.onWinner(car, end);

          this.winnerDeclared = true;

          void this.winnersService.upsert(car.id, { time: end, wins: 1 }, signal);
        }
      },
      () => {
        callbacks.onCarCrash(car);
      }
    );
  }

  private startEngine(car: Car, signal: AbortSignal): Promise<CarWithDriveMetrics> {
    const { id } = car;

    const stopIfStarted = this.startedEngines.has(id) ? this.stopEngine(id) : Promise.resolve();

    return stopIfStarted.then(() => {
      return this.engineService.toggle(id, 'started', signal).then((metrics) => {
        this.startedEngines.add(id);

        return { ...car, ...metrics };
      });
    });
  }

  private stopAllEngines(): Promise<void> {
    const promises = Array.from(this.startedEngines, (cardId) => this.stopEngine(cardId));

    return Promise.all(promises).then(() => {
      this.startedEngines.clear();
    });
  }
}
