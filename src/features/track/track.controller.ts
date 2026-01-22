import type { GaragePageEvents } from '../../app/garage-emitter/garage-emitter';
import type { EngineService } from '../../services/engine-service/engine.service';
import type { GarageService } from '../../services/garage-service/garage.service';
import type { Car } from '../../services/garage-service/types';
import type { WinnersService } from '../../services/winners-service/winners.service';
import type { Emitter } from '../../shared/emitter/emitter';
import type { TrackView } from './track.view';

import { toastService } from '../../components/toast/toast.service';
import { isAbortError } from '../../shared/utilities';
import { CarController } from '../car/car.controller';
import { CarView } from '../car/car.view';

const MILLISECONDS_IN_SECONDS = 1000;
const FRACTION_DIGITS = 2;

export class TrackController {
  private carControllers: CarController[] = [];

  private readonly emitter: Emitter<GaragePageEvents> | null = null;

  private readonly engineService: EngineService;

  private readonly garageService: GarageService;

  private readonly singleStartedEngines = new Set<number>();

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

    this.setupEmitterHandlers();
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

  public async startRace(): Promise<void> {
    this.stopAbortController?.abort();
    this.stopAbortController = null;

    this.startAbortController = this.recreateAbortcontroller(this.startAbortController);
    const startSignal = this.startAbortController.signal;

    await this.stopRunningCars();

    await this.startAllEngines(startSignal);

    const startTime = Date.now();
    const drivePromises = this.driveAllCars(startTime, startSignal);

    const winner = await Promise.any(drivePromises).catch(() => null);

    if (winner) {
      await this.winnersService.upsert(winner.id, { time: winner.time, wins: 1 });

      toastService.show({
        message: `"${winner.name}" wins! Time: ${winner.time.toString()}s`,
        type: 'success',
      });
    }

    await Promise.allSettled(drivePromises);
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

  public updateView(cars: Car[]): void {
    this.carControllers = cars.map((car) => {
      const controller = new CarController(
        new CarView({ car, emitter: this.emitter }),
        this.engineService,
        this.garageService,
        this.emitter
      );

      controller.setOnSingleStart((id) => {
        this.singleStartedEngines.add(id);
      });

      return controller;
    });

    this.view.setState({ carControllers: this.carControllers });
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

  private onRaceStart(): void {
    for (const controller of this.carControllers) {
      controller.disableButtons();
    }

    this.startRace().catch((error: unknown) => {
      if (isAbortError(error)) {
        return;
      }

      toastService.show({ message: 'Failed to start race', type: 'error' });
    });
  }

  private onRaceStop(): void {
    this.stopRace().catch((error: unknown) => {
      if (isAbortError(error)) {
        return;
      }

      toastService.show({ message: 'Failed to stop race', type: 'error' });
    });
  }

  private recreateAbortcontroller(controller: AbortController | null): AbortController {
    controller?.abort();
    return new AbortController();
  }

  private setupEmitterHandlers(): void {
    if (!this.emitter) {
      return;
    }

    const unsubscribeStartRace = this.emitter.on('race:start', () => {
      this.onRaceStart();
    });

    const unsubscribeStopRace = this.emitter.on('race:stop', () => {
      this.onRaceStop();
    });

    const unsubscribeCreateHundred = this.emitter.on('garage:create-hundred', () => {
      this.garageService.createRandomCars().then(
        () => this.emitter?.emit('garage:created-hundred'),
        () => {
          toastService.show({ message: 'Failed to create hundred cars', type: 'error' });
        }
      );
    });

    const unsubscribeCreateOne = this.emitter.on('garage:create-one', (payload) => {
      this.garageService.create(payload).then(
        () => this.emitter?.emit('garage:created-one'),
        () => {
          toastService.show({ message: 'Failed to create one car', type: 'error' });
        }
      );
    });

    this.unsubscribeFunctions
      .add(unsubscribeStartRace)
      .add(unsubscribeStopRace)
      .add(unsubscribeCreateHundred)
      .add(unsubscribeCreateOne);
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

  private async stopRunningCars(): Promise<void> {
    if (this.singleStartedEngines.size === 0) {
      return;
    }

    const stopPromises = this.carControllers
      .filter((c) => this.singleStartedEngines.has(c.getCarId()))
      .map((controller) => controller.stop().catch(() => null));

    await Promise.all(stopPromises);

    this.singleStartedEngines.clear();
  }
}

function getElapsedSeconds(startTime: number): number {
  const elapsedMs = Date.now() - startTime;

  return Number((elapsedMs / MILLISECONDS_IN_SECONDS).toFixed(FRACTION_DIGITS));
}
