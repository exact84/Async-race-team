import type { EngineService } from '../../services/engine-service/engine.service';
import type { GarageService } from '../../services/garage-service/garage.service';
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

    this.initialize().then(console.warn, console.warn);
  }

  public getView(): HTMLElement {
    return this.view;
  }

  public async initialize(): Promise<void> {
    const cars = await this.garageService.getAll();

    this.carControllers = cars.map(
      (car) => new CarController(new CarView(car), this.engineService, this.garageService)
    );

    console.warn(this.carControllers);

    this.view.setState({ carControllers: this.carControllers });
  }

  public async startRace(): Promise<void> {
    const signal = new AbortController().signal;
    await this.startAllEngines(signal);

    const start = Date.now();

    const drivePromises = this.carControllers.map((c) =>
      c
        .drive(signal)
        .then((result) => ({ ...result, time: getElapsedSeconds(start) }))
        .catch(() => {
          c.pauseAnimation();
          throw new Error('crashed');
        })
    );

    const winner = await Promise.any(drivePromises).catch(() => null);

    if (winner) {
      console.warn('Winner in race:', winner);
      const savedWinner = await this.winnersService.upsert(winner.id, {
        time: winner.time,
        wins: 1,
      });
      console.warn('Winner saved in DB:', savedWinner);
    } else {
      console.warn('ALL CARS CRASHED');
    }

    await Promise.allSettled(drivePromises);
    console.warn('RACE ENDED');
  }

  private async startAllEngines(signal: AbortSignal): Promise<void> {
    await Promise.all(
      this.carControllers.map((c) => {
        c.disableButtons();
        return c.startEngine(signal);
      })
    );

    for (const controller of this.carControllers) {
      controller.startAnimation();
    }
  }
}

function getElapsedSeconds(startTime: number): number {
  const elapsedMs = Date.now() - startTime;
  return Number.parseFloat((elapsedMs / MILLISECONDS_IN_SECONDS).toFixed(FRACTION_DIGITS));
}
