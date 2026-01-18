import { div } from '@ripetchor/dom';

import type { CarController } from '../car/car.controller';

import { Component, defineElement } from '../../shared/component/component';
import { createFragment } from '../../shared/utilities';
import styles from './track.view.module.css';

interface State {
  carControllers: CarController[];
}

export class TrackView extends Component<object, State> {
  public constructor() {
    super();

    this.state = { carControllers: [] };

    this.className = styles.container;
  }

  public render(): DocumentFragment {
    return createFragment(
      ...this.state.carControllers.map((controller) =>
        div({ className: styles.trackLane }, controller.getView())
      )
    );
  }
}

defineElement('track', TrackView);
