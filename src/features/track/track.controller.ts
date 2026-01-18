import type { EngineService } from '../../services/engine-service/engine.service';
import type { GarageService } from '../../services/garage-service/garage.service';
import type { TrackView } from './track.view';

import { CarController } from '../car/car.controller';
import { CarView } from '../car/car.view';

export class TrackController {
  private carControllers: CarController[] = [];

  private readonly engineService: EngineService;

  private readonly garageService: GarageService;

  private readonly view: TrackView;

  public constructor(view: TrackView, engineService: EngineService, garageService: GarageService) {
    this.view = view;
    this.engineService = engineService;
    this.garageService = garageService;

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
}
