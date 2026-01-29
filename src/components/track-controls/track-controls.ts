import type { GaragePageEvents } from '../../app/garage-emitter/garage-emitter';
import type { Emitter } from '../../shared/emitter/emitter';

import { garageStore } from '../../app/store/garage-store';
import { Component, defineElement } from '../../shared/component/component';
import { createFragment } from '../../shared/utilities';
import { Button } from '../button/button';
import { CarForm } from '../car-form/car-form';
import { Modal } from '../modal/modal';
import styles from './track-controls.module.css';

export interface TrackControlProperties {
  emitter: Emitter<GaragePageEvents>;
}

export class TrackControls extends Component<TrackControlProperties> {
  private readonly buttonCreateHundred = new Button({
    onClick: (): void => {
      this.props.emitter.emit('garage:create-hundred');
    },
    testid: 'button-track-create-100',
    textContent: 'Create 100 cars',
  });

  private readonly buttonCreateOne = new Button({
    onClick: (): void => {
      const { color, id, name } = garageStore.getState().createCarFields;

      const carForm = new CarForm({
        color,
        id,
        mode: 'create',
        name,
        onSubmit: (data): void => {
          this.props.emitter.emit('garage:create-one', { color: data.color, name: data.name });
          carForm.remove();
          modal.close();
        },
      });

      const modal = new Modal({
        onClose: (): void => {
          garageStore.setState({ createCarFields: carForm.getFormData() });
        },
        title: 'Create car',
      });

      modal.open(() => carForm);
    },
    testid: 'button-track-create-1',
    textContent: 'Create car',
  });

  private readonly buttonReset = new Button({
    onClick: (): void => {
      this.setButtonsState({ createHundred: false, createOne: false, start: false, stop: true });

      this.props.emitter.emit('race:stop');
    },
    testid: 'button-track-stop',
    textContent: 'Reset race',
  });

  private readonly buttonStart = new Button({
    onClick: (): void => {
      this.setButtonsState({ createHundred: true, createOne: true, start: true, stop: false });

      this.props.emitter.emit('race:start');
    },
    testid: 'button-track-start',
    textContent: 'Start race',
  });

  public constructor(properties: TrackControlProperties) {
    super(properties);

    this.className = styles.container;

    this.setButtonsState({ createHundred: false, createOne: false, start: false, stop: true });
  }

  public render(): DocumentFragment | HTMLElement {
    return createFragment(
      this.buttonStart,
      this.buttonReset,
      this.buttonCreateOne,
      this.buttonCreateHundred
    );
  }

  public setButtonsState(options: {
    createHundred?: boolean;
    createOne?: boolean;
    start?: boolean;
    stop?: boolean;
  }): void {
    const defaultValue = false;

    this.buttonStart.toggleDisabled(options.start ?? defaultValue);
    this.buttonReset.toggleDisabled(options.stop ?? defaultValue);
    this.buttonCreateOne.toggleDisabled(options.createOne ?? defaultValue);
    this.buttonCreateHundred.toggleDisabled(options.createHundred ?? defaultValue);
  }
}

defineElement('track-controls', TrackControls);
