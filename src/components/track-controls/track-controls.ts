import type { GaragePageEvents } from '../../app/garage-emitter/garage-emitter';
import type { Emitter } from '../../shared/event-emitter/event-emitter';

import { Component, defineElement } from '../../shared/component/component';
import { createFragment } from '../../shared/utilities';
import { Button } from '../button/button';
import styles from './track-controls.module.css';

export interface TrackControlProperties {
  emitter: Emitter<GaragePageEvents>;
}

export class TrackControls extends Component<TrackControlProperties> {
  private readonly buttonCreateHundred = new Button({
    onClick: (): void => {
      console.warn('Create 100 clicked');
    },
    textContent: 'Create 100 cars',
  });

  private readonly buttonCreateOne = new Button({
    onClick: (): void => {
      console.warn('Create 1 clicked');
    },
    textContent: 'Create car',
  });

  private readonly buttonStart = new Button({
    onClick: (): void => {
      this.setButtonsState({ createHundred: true, createOne: true, start: true, stop: false });

      this.props.emitter.emit('race:start');
    },
    textContent: 'Start race',
  });

  private readonly buttonStop = new Button({
    onClick: (): void => {
      this.setButtonsState({ createHundred: false, createOne: false, start: false, stop: true });

      this.props.emitter.emit('race:stop');
    },
    textContent: 'Stop race',
  });

  public constructor(properties: TrackControlProperties) {
    super(properties);

    this.className = styles.container;

    this.setButtonsState({ createHundred: false, createOne: false, start: false, stop: true });
  }

  public render(): DocumentFragment | HTMLElement {
    return createFragment(
      this.buttonStart,
      this.buttonStop,
      this.buttonCreateOne,
      this.buttonCreateHundred
    );
  }

  private setButtonsState(options: {
    createHundred?: boolean;
    createOne?: boolean;
    start?: boolean;
    stop?: boolean;
  }): void {
    const defaultValue = false;

    this.buttonStart.toggleDisabled(options.start ?? defaultValue);
    this.buttonStop.toggleDisabled(options.stop ?? defaultValue);
    this.buttonCreateOne.toggleDisabled(options.createOne ?? defaultValue);
    this.buttonCreateHundred.toggleDisabled(options.createHundred ?? defaultValue);
  }
}

defineElement('track-controls', TrackControls);
