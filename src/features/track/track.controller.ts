import type { GaragePageEvents } from '../../app/garage-emitter/garage-emitter';
import type { EngineService } from '../../services/engine-service/engine.service';
// import type { DriveMetrics } from '../../services/engine-service/types';
import type { GarageService } from '../../services/garage-service/garage.service';
import type { Car } from '../../services/garage-service/types';
import type { WinnersService } from '../../services/winners-service/winners.service';
import type { Emitter } from '../../shared/event-emitter/event-emitter';
import type { TrackView } from './track.view';

import { CarController } from '../car/car.controller';
import { CarView } from '../car/car.view';

const MILLISECONDS_IN_SECONDS = 1000;
const FRACTION_DIGITS = 2;

export class TrackController {
  private carControllers: CarController[] = [];

  private readonly emitter: Emitter<GaragePageEvents> | null = null;

  private readonly engineService: EngineService;

  private readonly garageService: GarageService;

  private startAbortController: AbortController | null = null;

  private readonly startedEngines = new Set<number>();

  private stopAbortController: AbortController | null = null;

  private readonly unsubscribeFunctions = new Set<VoidFunction>();

  private readonly view: TrackView;

  private readonly winnersService: WinnersService;

  public constructor(
    view: TrackView,
    engineService: EngineService,
    garageService: GarageService,
    winnersService: WinnersService,
    emitter: Emitter<GaragePageEvents> | null = null
  ) {
    this.view = view;
    this.engineService = engineService;
    this.garageService = garageService;
    this.winnersService = winnersService;

    this.emitter = emitter;
  }

  public deinitialize(): void {
    this.startAbortController?.abort();

    for (const unsubscribe of this.unsubscribeFunctions) {
      unsubscribe();
    }

    this.unsubscribeFunctions.clear();
  }

  public getView(): HTMLElement {
    return this.view;
  }

  public async initialize(): Promise<void> {
    this.setupListeners();

    const cars = await this.garageService.getAll();

    this.carControllers = cars.map(
      (car) => new CarController(new CarView(car), this.engineService, this.garageService)
    );

    this.view.setState({ carControllers: this.carControllers });
  }

  public async startRace(): Promise<void> {
    this.stopAbortController?.abort();
    this.stopAbortController = null;

    this.startAbortController = this.recreateAbortcontroller(this.startAbortController);
    const startSignal = this.startAbortController.signal;

    // await this.stopAllCars();
    await this.startAllEngines(startSignal);

    const startTime = Date.now();
    const drivePromises = this.driveAllCars(startTime, startSignal);

    const winner = await Promise.any(drivePromises).catch(() => null);

    if (winner) {
      await this.winnersService.upsert(winner.id, { time: winner.time, wins: 1 });
    }

    await Promise.allSettled(drivePromises);

    this.emitter?.emit('race:completed');
  }

  public async stopRace(): Promise<void> {
    this.startAbortController?.abort();
    this.startAbortController = null;

    this.stopAbortController = this.recreateAbortcontroller(this.stopAbortController);
    const stopSignal = this.stopAbortController.signal;

    const stopPromises = Array.from(this.startedEngines, (id) =>
      this.engineService.toggle(id, 'stopped', stopSignal)
    );

    await Promise.all(stopPromises);

    this.startedEngines.clear();

    for (const controller of this.carControllers) {
      controller.stopAnimation();
      controller.enableButtons();
    }
  }

  private driveAllCars(
    startTime: number,
    signal: AbortSignal
  ): Promise<Car & { success: boolean; time: number }>[] {
    return this.carControllers.map((controller) =>
      controller
        .drive(signal)
        .then((result) => ({ ...result, time: getElapsedSeconds(startTime) }))
        .catch(() => {
          controller.pauseAnimation();

          throw new Error('Car crashed');
        })
    );
  }

  private recreateAbortcontroller(controller: AbortController | null): AbortController {
    controller?.abort();
    return new AbortController();
  }

  private setupListeners(): void {
    if (!this.emitter) {
      return;
    }

    const unusbscribeStartRace = this.emitter.on('race:start', () => {
      for (const controller of this.carControllers) {
        controller.disableButtons();
      }

      this.startRace().catch(console.warn);
    });

    const unsubscribeStopRace = this.emitter.on('race:stop', () => {
      this.stopRace().catch(console.warn);
    });

    this.unsubscribeFunctions.add(unusbscribeStartRace).add(unsubscribeStopRace);
  }

  private async startAllEngines(signal: AbortSignal): Promise<void> {
    await Promise.all(
      this.carControllers.map((controller) => {
        this.startedEngines.add(controller.getCarId());

        return controller.startEngine(signal);
      })
    );

    for (const controller of this.carControllers) {
      controller.startAnimation();
    }
  }

  // private stopAllCars(): Promise<(DriveMetrics | null)[]> {
  //   const stopPromises = this.carControllers.map((controller) => {
  //     return controller.stop().catch(() => null);
  //   });

  //   return Promise.all(stopPromises);
  // }
}

function getElapsedSeconds(startTime: number): number {
  const elapsedMs = Date.now() - startTime;

  return Number((elapsedMs / MILLISECONDS_IN_SECONDS).toFixed(FRACTION_DIGITS));
}
