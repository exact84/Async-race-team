import type { EngineService } from '../engine-service/engine.service';
import type { DriveMetrics } from '../engine-service/types';
import type { GarageService } from '../garage-service/garage.service';
import type { Car } from '../garage-service/types';
import type { WinnersService } from '../winners-service/winners.service';
import type {
  CarRaceParameters,
  CarWithDriveMetrics,
  RaceParameters,
  SingleCarParameters,
} from './types';

export class RaceService {
  private static instance: null | RaceService = null;

  private readonly engineService: EngineService;

  private readonly garageService: GarageService;

  private raceAbortController: AbortController | null = new AbortController();

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

  public startCarSingle(car: Car, parameters: SingleCarParameters): Promise<void> {
    const { signal } = parameters;

    return this.startEngine(car, signal)
      .then(() => this.engineService.drive(car.id, signal))
      .then(
        () => {
          parameters.onFinish(car);
        },
        () => {
          parameters.onCrash(car);
        }
      );
  }

  public startRace(parameters: RaceParameters): Promise<void> {
    this.winnerDeclared = false;

    const signal = this.recreateRaceAbortController(parameters.signal);

    parameters.onRaceStart();

    return this.garageService
      .getAll({ signal })
      .then((cars) => Promise.all(this.startAllEngines(cars, signal)))
      .then((engines) => this.driveAllCars(engines, { ...parameters, signal }))
      .then(() => {
        parameters.onRaceEnded();
      });
  }

  public stopEngine(carId: number): Promise<DriveMetrics> {
    return this.engineService
      .toggle(carId, 'stopped')
      .finally(() => this.startedEngines.delete(carId));
  }

  public stopRace(): Promise<void> {
    this.raceAbortController?.abort();
    this.raceAbortController = null;

    this.winnerDeclared = false;

    return this.stopAllEngines();
  }

  private driveAllCars(
    engines: CarWithDriveMetrics[],
    parameters: CarRaceParameters
  ): Promise<PromiseSettledResult<void>[]> {
    const promises = engines.map((engine) => this.startCarRace(engine, parameters));

    return Promise.allSettled(promises);
  }

  private recreateRaceAbortController(parentSignal: AbortSignal): AbortSignal {
    if (this.raceAbortController) {
      this.raceAbortController.abort();
      this.raceAbortController = null;
    }

    this.raceAbortController = new AbortController();

    parentSignal.addEventListener(
      'abort',
      () => {
        this.raceAbortController?.abort();
      },
      { once: true }
    );

    return this.raceAbortController.signal;
  }

  private startAllEngines(cars: Car[], signal: AbortSignal): Promise<CarWithDriveMetrics>[] {
    const stopPromise = this.stopAllEngines();

    return cars.map((car) => stopPromise.then(() => this.startEngine(car, signal)));
  }

  private startCarRace(car: Car, parameters: CarRaceParameters): Promise<void> {
    const { signal } = parameters;

    const start = Date.now();

    return this.engineService.drive(car.id, signal).then(
      async () => {
        if (!this.winnerDeclared) {
          const end = Date.now() - start;

          parameters.onWinner(car, end);

          this.winnerDeclared = true;

          await this.winnersService.upsert(car.id, { time: end, wins: 1 }, signal);
        }
      },
      () => {
        parameters.onCarCrash(car);
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
