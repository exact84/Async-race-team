import { div, p } from '@ripetchor/dom';

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

  public render(): DocumentFragment | HTMLElement {
    if (this.state.carControllers.length === 0) {
      return p(
        { className: styles.fallbackMessage },
        'You’ve removed all cars. Create some to get started.'
      );
    }

    return createFragment(
      ...this.state.carControllers.map((controller) => {
        const trackLane = div(
          { 'className': styles.trackLane, 'data-testid': 'track-lane' },
          controller.getView()
        );

        controller.setOnRemove(() => {
          trackLane.remove();
        });

        return trackLane;
      })
    );
  }
}

defineElement('track', TrackView);
