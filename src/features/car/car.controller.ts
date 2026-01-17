import type { EngineService } from '../../services/engine-service/engine.service';
import type { DriveMetrics, DriveResult } from '../../services/engine-service/types';
import type { GarageService } from '../../services/garage-service/garage.service';
import type { Car } from '../../services/garage-service/types';
import type { CarView } from './car.view';

export class CarController {
  private readonly carId: number;

  private driveAbortController: AbortController | null = null;

  private readonly engineService: EngineService;

  private readonly garageService: GarageService;

  private readonly view: CarView;

  public constructor(view: CarView, engineService: EngineService, garageService: GarageService) {
    this.view = view;
    this.engineService = engineService;
    this.garageService = garageService;

    this.carId = view.getProps().id;

    this.view.setCallbacks({
      onDelete: () => this.delete(),
      onDrive: (signal) => this.drive(signal),
      onStop: () => this.stop(),
      onUpdate: (data) => this.update(data),
    });
  }

  public delete(): Promise<object> {
    return this.garageService.delete(this.carId, this.driveAbortController?.signal);
  }

  public drive(parentSignal: AbortSignal): Promise<DriveResult> {
    const signal = this.recreateDriveAbortController(parentSignal);

    return this.startEngine(signal).then(() => this.engineService.drive(this.carId, signal));
  }

  public getView(): HTMLElement {
    return this.view;
  }

  public startEngine(signal: AbortSignal): Promise<DriveMetrics> {
    return this.engineService.toggle(this.carId, 'started', signal).then((metrics) => {
      this.view.setDriveMetrics(metrics);
      this.view.drive();
      return metrics;
    });
  }

  public stop(): Promise<DriveMetrics> {
    this.driveAbortController?.abort();
    this.driveAbortController = null;

    const stopController = new AbortController();

    const viewSignal = this.view.getAbortSignal();

    viewSignal.addEventListener(
      'abort',
      () => {
        stopController.abort();
      },
      { once: true }
    );

    return this.engineService.toggle(this.carId, 'stopped', stopController.signal);
  }

  public update(data: Omit<Car, 'id'>): Promise<Car> {
    return this.garageService.update(this.carId, data, this.driveAbortController?.signal);
  }

  private recreateDriveAbortController(parentSignal: AbortSignal): AbortSignal {
    if (this.driveAbortController) {
      this.driveAbortController.abort();
      this.driveAbortController = null;
    }

    this.driveAbortController = new AbortController();

    parentSignal.addEventListener(
      'abort',
      () => {
        this.driveAbortController?.abort();
      },
      { once: true }
    );

    return this.driveAbortController.signal;
  }
}
