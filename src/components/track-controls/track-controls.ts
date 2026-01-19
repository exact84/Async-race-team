import { Component, defineElement } from '../../shared/component/component';
import { createFragment } from '../../shared/utilities';
import { Button } from '../button/button';
import styles from './track-controls.module.css';

export class TrackControls extends Component {
  private readonly createHundredButton = new Button({
    onClick: (): void => {
      console.warn('Create 100 clicked');
    },
    textContent: 'Create 100 cars',
  });

  private readonly createOneButton = new Button({
    onClick: (): void => {
      console.warn('Create 1 clicked');
    },
    textContent: 'Create car',
  });

  private readonly startButton = new Button({
    onClick: (): void => {
      console.warn('Start clicked');
    },
    textContent: 'Start race',
  });

  private readonly stopButton = new Button({
    onClick: (): void => {
      console.warn('Stop clicked');
    },
    textContent: 'Stop race',
  });

  public constructor() {
    super();

    this.className = styles.container;
  }

  public render(): DocumentFragment | HTMLElement {
    return createFragment(
      this.startButton,
      this.stopButton,
      this.createOneButton,
      this.createHundredButton
    );
  }
}

defineElement('track-controls', TrackControls);
