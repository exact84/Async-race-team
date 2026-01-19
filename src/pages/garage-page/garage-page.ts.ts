import { div, h1 } from '@ripetchor/dom';

import { garageEmitter } from '../../app/garage-emitter/garage-emitter';
import { TrackControls } from '../../components/track-controls/track-controls';
import { TrackController } from '../../features/track/track.controller';
import { TrackView } from '../../features/track/track.view';
import { serviceProvider } from '../../services/service-provider';
import { Component, defineElement } from '../../shared/component/component';

interface State {
  carsCount: string;
}

const engineService = serviceProvider.engineService();
const garageService = serviceProvider.garageService();
const winnersService = serviceProvider.winnersService();

export class GaragePage extends Component<object, State> {
  private readonly trackController: TrackController;

  public constructor() {
    super();

    this.state = { carsCount: '0' };

    this.trackController = new TrackController(
      new TrackView(),
      engineService,
      garageService,
      winnersService,
      garageEmitter
    );

    this.trackController.initialize().catch(console.warn);
  }

  public render(): HTMLElement {
    const trackControls = new TrackControls({ emitter: garageEmitter });

    return div(
      { className: 'page' },
      h1(null, `Garage (${this.state.carsCount})`),
      trackControls,
      this.trackController.getView()
    );
  }

  protected override connectedCallback(): void {
    garageService.getTotalCount().then(
      (count) => {
        this.setState({ carsCount: count ?? '0' });
      },
      () => {
        console.warn('Failed to get cars count');
      }
    );

    super.connectedCallback();
  }

  protected disconnectedCallback(): void {
    this.trackController.deinitialize();
  }
}

defineElement('garage-page', GaragePage);
