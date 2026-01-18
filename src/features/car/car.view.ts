import { div } from '@ripetchor/dom';

import type { DriveMetrics, DriveResult } from '../../services/engine-service/types';
import type { Car } from '../../services/garage-service/types';

import { Button } from '../../components/button/button';
import { CarImage } from '../../components/car-image/car-image';
import { createRandomCar } from '../../services/garage-service/utilities';
import { Component, defineElement } from '../../shared/component/component';
import { createFragment } from '../../shared/utilities';
import styles from './car.view.module.css';

export interface CarViewCallbacks {
  onDelete(): Promise<object>;
  onDrive(signal: AbortSignal): Promise<DriveResult>;
  onStop(): Promise<DriveMetrics>;
  onUpdate(data: Omit<Car, 'id'>): Promise<Car>;
}

interface State {
  color: string;
  name: string;
}

const CROSS_LINE_WIDTH = 20;

export class CarView extends Component<Car, State> {
  private abortController: AbortController | null = null;

  private animation: Animation | null = null;

  private buttonDelete = new Button({
    buttonSize: 'sm',
    testid: 'button-delete',
    textContent: 'Delete',
  });

  private buttonStart = new Button({
    buttonSize: 'sm',
    testid: 'button-start',
    textContent: 'Start',
  });

  private buttonStop = new Button({ buttonSize: 'sm', testid: 'button-stop', textContent: 'Stop' });

  private buttonUpdate = new Button({
    buttonSize: 'sm',
    testid: 'button-update',
    textContent: 'Update',
  });

  private callbacks: CarViewCallbacks | null = null;

  private carImage: CarImage | null = null;

  private driveMetrics: DriveMetrics | null = null;

  public constructor(properties: Car) {
    super(properties);

    this.state = { color: this.props.color, name: this.props.name };

    this.className = styles.container;

    this.setButtonsState({ delete: false, start: false, stop: true, update: false });
  }

  public getAbortSignal(): AbortSignal {
    this.abortController ??= new AbortController();

    return this.abortController.signal;
  }

  public pauseAnimation(): void {
    if (this.animation) {
      this.animation.pause();
    }
  }

  public render(): DocumentFragment {
    this.abortController?.abort();
    this.abortController = null;

    this.abortController = new AbortController();

    this.initializeButtonListeners();

    this.carImage = new CarImage({ color: this.state.color });

    return createFragment(
      div(null, this.state.name),
      this.carImage,
      div(
        { className: styles.buttonsContainer },
        this.buttonStart,
        this.buttonStop,
        this.buttonUpdate,
        this.buttonDelete
      )
    );
  }

  public setButtonsState(options: {
    delete?: boolean;
    start?: boolean;
    stop?: boolean;
    update?: boolean;
  }): void {
    const defaultValue = false;

    this.buttonDelete.toggleDisabled(options.delete ?? defaultValue);
    this.buttonStart.toggleDisabled(options.start ?? defaultValue);
    this.buttonStop.toggleDisabled(options.stop ?? defaultValue);
    this.buttonUpdate.toggleDisabled(options.update ?? defaultValue);
  }

  public setCallbacks(callbacks: CarViewCallbacks): void {
    this.callbacks = callbacks;
  }

  public setDriveMetrics(driveMetrics: DriveMetrics): void {
    this.driveMetrics = driveMetrics;
  }

  public startAnimation(): void {
    if (!this.carImage || !this.driveMetrics) {
      return;
    }

    const endWidth = this.clientWidth - this.carImage.clientWidth - CROSS_LINE_WIDTH;

    const duration = this.driveMetrics.distance / this.driveMetrics.velocity;

    const animationData = { transform: ['translateX(0)', `translateX(${endWidth.toString()}px)`] };

    if (this.animation) {
      this.animation.cancel();
      this.animation = null;
    }

    this.animation = this.carImage.animate(animationData, { duration });

    this.animation.addEventListener(
      'finish',
      () => {
        if (!this.carImage) {
          return;
        }

        this.carImage.style.transform = `translateX(${endWidth.toString()}px)`;

        this.animation = null;
      },
      { once: true }
    );
  }

  public stopAnimation(): void {
    if (!this.carImage) {
      return;
    }

    this.carImage.style.transform = 'translateX(0)';

    if (this.animation) {
      this.animation.cancel();
      this.animation = null;
    }
  }

  protected disconnectedCallback(): void {
    this.abortController?.abort();
    this.abortController = null;
  }

  private initializeButtonListeners(): void {
    this.buttonStart.addEventListener(
      'click',
      () => {
        void this.onStartButtonClick();
      },
      { signal: this.getAbortSignal() }
    );

    this.buttonStop.addEventListener(
      'click',
      () => {
        void this.onStopButtonClick();
      },
      { signal: this.getAbortSignal() }
    );

    this.buttonDelete.addEventListener(
      'click',
      () => {
        void this.onDeleteButtonClick();
      },
      { signal: this.getAbortSignal() }
    );

    this.buttonUpdate.addEventListener(
      'click',
      () => {
        void this.onUpdateButtonClick();
      },
      { signal: this.getAbortSignal() }
    );
  }

  private async onDeleteButtonClick(): Promise<void> {
    this.setButtonsState({ delete: true, start: true, stop: true, update: true });

    try {
      await this.callbacks?.onDelete();

      this.remove();
    } catch {
      this.setButtonsState({ delete: false, start: false, stop: true, update: false });
    }
  }

  private async onStartButtonClick(): Promise<void> {
    this.setButtonsState({ delete: true, start: true, stop: false, update: true });

    try {
      await this.callbacks?.onDrive(this.getAbortSignal());
    } catch {
      this.pauseAnimation();
    } finally {
      this.setButtonsState({ delete: true, start: true, stop: false, update: true });
    }
  }

  private async onStopButtonClick(): Promise<void> {
    this.setButtonsState({ delete: true, start: true, stop: true, update: true });

    try {
      await this.callbacks?.onStop();

      this.stopAnimation();
    } finally {
      this.setButtonsState({ delete: false, start: false, stop: true, update: false });
    }
  }

  private async onUpdateButtonClick(): Promise<void> {
    this.setButtonsState({ delete: true, start: true, stop: true, update: true });

    try {
      // TODO: replace by modal and form
      const car = await this.callbacks?.onUpdate(createRandomCar());

      if (!car) {
        return;
      }

      this.setState({ color: car.color, name: car.name });
    } finally {
      this.setButtonsState({ delete: false, start: false, stop: true, update: false });
    }
  }
}

defineElement('car', CarView);
