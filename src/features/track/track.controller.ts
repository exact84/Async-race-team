import type { EngineService } from '../../services/engine-service/engine.service';
import type { GarageService } from '../../services/garage-service/garage.service';
import type { Car } from '../../services/garage-service/types';
import type { WinnersService } from '../../services/winners-service/winners.service';
import type { TrackView } from './track.view';

import { CarController } from '../car/car.controller';
import { CarView } from '../car/car.view';

const MILLISECONDS_IN_SECONDS = 1000;
const FRACTION_DIGITS = 2;

export class TrackController {
  private carControllers: CarController[] = [];

  private readonly engineService: EngineService;

  private readonly garageService: GarageService;

  private readonly startedEngines = new Set<number>();

  private trackAbortController: AbortController | null = null;

  private readonly view: TrackView;

  private readonly winnersService: WinnersService;

  public constructor(
    view: TrackView,
    engineService: EngineService,
    garageService: GarageService,
    winnersService: WinnersService
  ) {
    this.view = view;
    this.engineService = engineService;
    this.garageService = garageService;
    this.winnersService = winnersService;
  }

  public getView(): HTMLElement {
    return this.view;
  }

  public async initialize(): Promise<void> {
    const cars = await this.garageService.getAll();

    this.carControllers = cars.map(
      (car) => new CarController(new CarView(car), this.engineService, this.garageService)
    );

    this.view.setState({ carControllers: this.carControllers });
  }

  public async startRace(): Promise<void> {
    this.trackAbortController?.abort();
    this.trackAbortController = new AbortController();

    const signal = this.trackAbortController.signal;

    await this.startAllEngines(signal);

    const startTime = Date.now();

    const drivePromises = this.driveAllCars(startTime, signal);

    const winner = await Promise.any(drivePromises).catch(() => null);

    if (winner) {
      await this.winnersService.upsert(winner.id, { time: winner.time, wins: 1 });
    }

    await Promise.allSettled(drivePromises);
  }

  public async stopRace(): Promise<void> {
    if (!this.trackAbortController) {
      return;
    }

    this.trackAbortController.abort();
    this.trackAbortController = null;

    const stopPromises = Array.from(this.startedEngines, (id) =>
      this.engineService.toggle(id, 'stopped')
    );

    await Promise.all(stopPromises);

    this.startedEngines.clear();

    for (const controller of this.carControllers) {
      controller.stopAnimation();
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

  private async startAllEngines(signal: AbortSignal): Promise<void> {
    await Promise.all(
      this.carControllers.map((controller) => {
        this.startedEngines.add(controller.getCarId());
        controller.disableButtons();

        return controller.startEngine(signal);
      })
    );

    for (const controller of this.carControllers) {
      controller.startAnimation();
    }
  }
}

function getElapsedSeconds(startTime: number): number {
  const elapsedMs = Date.now() - startTime;

  return Number((elapsedMs / MILLISECONDS_IN_SECONDS).toFixed(FRACTION_DIGITS));
}
