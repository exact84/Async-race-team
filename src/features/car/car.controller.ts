import type { GaragePageEvents } from '../../app/garage-emitter/garage-emitter';
import type { EngineService } from '../../services/engine-service/engine.service';
import type { DriveMetrics, DriveResult } from '../../services/engine-service/types';
import type { GarageService } from '../../services/garage-service/garage.service';
import type { Car } from '../../services/garage-service/types';
import type { Emitter } from '../../shared/emitter/emitter';
import type { CarView } from './car.view';

type SingleStartCallback = (id: number) => void;

export class CarController {
  private readonly carId: number;

  private driveAbortController: AbortController | null = null;

  private readonly emitter: Emitter<GaragePageEvents> | null = null;

  private readonly engineService: EngineService;

  private readonly garageService: GarageService;

  private onSingleStart: null | SingleStartCallback = null;

  private readonly view: CarView;

  public constructor(
    view: CarView,
    engineService: EngineService,
    garageService: GarageService,
    emitter: Emitter<GaragePageEvents> | null = null
  ) {
    this.view = view;
    this.engineService = engineService;
    this.garageService = garageService;

    this.emitter = emitter;

    this.carId = view.getCarData().id;

    this.view.setCallbacks({
      onDelete: () => this.delete(),
      onDrive: (signal) => this.startAndDrive(signal),
      onStop: () => this.stop(),
      onUpdate: (data) => this.update(data),
    });
  }

  public delete(): Promise<object> {
    return this.garageService.delete(this.carId).then(() => {
      this.emitter?.emit('garage:delete-car');
      return {};
    });
  }

  public disableButtons(): void {
    this.view.setButtonsState({ delete: true, start: true, stop: true, update: true });
  }

  public drive(parentSignal: AbortSignal): Promise<Car & { success: boolean }> {
    const signal = this.recreateDriveAbortController(parentSignal);

    return this.engineService
      .drive(this.carId, signal)
      .then((result) => ({ ...this.view.getCarData(), success: result.success }));
  }

  public enableButtons(): void {
    this.view.setButtonsState({ delete: false, start: false, stop: true, update: false });
  }

  public getCarId(): number {
    return this.carId;
  }

  public getView(): HTMLElement {
    return this.view;
  }

  public pauseAnimation(): void {
    this.view.pauseAnimation();
  }

  public setOnRemove(callback: VoidFunction): void {
    this.view.setOnRemove(callback);
  }

  public setOnSingleStart(callback: SingleStartCallback): void {
    this.onSingleStart = callback;
  }

  public startAndDrive(parentSignal: AbortSignal): Promise<DriveResult> {
    const signal = this.recreateDriveAbortController(parentSignal);

    this.onSingleStart?.(this.carId);

    return this.startEngine(signal).then(() => {
      this.startAnimation();

      return this.engineService.drive(this.carId, signal);
    });
  }

  public startAnimation(): void {
    this.view.startAnimation();
  }

  public startEngine(signal: AbortSignal): Promise<DriveMetrics> {
    return this.engineService.toggle(this.carId, 'started', signal).then((metrics) => {
      this.view.setDriveMetrics(metrics);
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

  public stopAnimation(): void {
    this.view.stopAnimation();
  }

  public update(data: Omit<Car, 'id'>): Promise<Car> {
    return this.garageService.update(this.carId, data);
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
