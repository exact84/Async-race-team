import { div, h1, span } from '@ripetchor/dom';

import { garageEmitter } from '../../app/garage-emitter/garage-emitter';
import { TrackControls } from '../../components/track-controls/track-controls';
import { TrackController } from '../../features/track/track.controller';
import { TrackView } from '../../features/track/track.view';
import { serviceProvider } from '../../services/service-provider';
import { Component, defineElement } from '../../shared/component/component';

const engineService = serviceProvider.engineService();
const garageService = serviceProvider.garageService();
const winnersService = serviceProvider.winnersService();

export class GaragePage extends Component {
  private readonly totalCarsSpan = span(null);

  private readonly trackController: TrackController;

  private readonly unsubscribeFunctions = new Set<VoidFunction>();

  public constructor() {
    super();

    this.trackController = new TrackController(
      new TrackView(),
      engineService,
      garageService,
      winnersService,
      garageEmitter
    );

    this.trackController.initialize().catch(console.warn);

    this.setupListeners();
  }

  public render(): HTMLElement {
    const trackControls = new TrackControls({ emitter: garageEmitter });

    return div(
      { className: 'page' },
      h1(null, 'Garage: ', this.totalCarsSpan),
      trackControls,
      this.trackController.getView()
    );
  }

  protected override connectedCallback(): void {
    this.updateTotalCarsCount();

    super.connectedCallback();
  }

  protected disconnectedCallback(): void {
    this.trackController.deinitialize();

    for (const unsubscribe of this.unsubscribeFunctions) {
      unsubscribe();
    }

    this.unsubscribeFunctions.clear();
  }

  private setupListeners(): void {
    const unsubscribeCreatedOne = garageEmitter.on('garage:created-one', () => {
      this.updateTotalCarsCount();
    });

    const unsubscribeCreatedHundred = garageEmitter.on('garage:created-hundred', () => {
      this.updateTotalCarsCount();
    });

    this.unsubscribeFunctions.add(unsubscribeCreatedOne).add(unsubscribeCreatedHundred);
  }

  private updateTotalCarsCount(): void {
    garageService.getTotalCount().then(
      (count) => {
        this.totalCarsSpan.textContent = count ?? '0';
      },
      () => {
        console.warn('Failed to get cars count');
      }
    );
  }
}

defineElement('garage-page', GaragePage);
