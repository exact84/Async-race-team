import { div, h1, span } from '@ripetchor/dom';

import { garageEmitter } from '../../app/garage-emitter/garage-emitter';
import { garageStore } from '../../app/garage-store/garage-store';
import { Pagination } from '../../components/pagination/pagination';
import { TrackControls } from '../../components/track-controls/track-controls';
import { TrackController } from '../../features/track/track.controller';
import { TrackView } from '../../features/track/track.view';
import { serviceProvider } from '../../services/service-provider';
import { Component, defineElement } from '../../shared/component/component';

const engineService = serviceProvider.engineService();
const garageService = serviceProvider.garageService();
const winnersService = serviceProvider.winnersService();

const CARS_PER_PAGE = 7;

export class GaragePage extends Component {
  private readonly pagination: Pagination;

  private readonly totalCarsSpan = span(null);

  private readonly trackController: TrackController;

  private readonly unsubscribeFunctions = new Set<VoidFunction>();

  public constructor() {
    super();

    this.pagination = new Pagination({
      onPageChange: (currentPage): void => {
        garageStore.setState({ currentPage });
      },
    });

    this.trackController = new TrackController(
      new TrackView(),
      engineService,
      garageService,
      winnersService,
      garageEmitter
    );
  }

  public render(): HTMLElement {
    const trackControls = new TrackControls({ emitter: garageEmitter });

    return div(
      { className: 'page' },
      h1(null, 'Garage: ', this.totalCarsSpan),
      this.pagination,
      trackControls,
      this.trackController.getView()
    );
  }

  protected override connectedCallback(): void {
    this.setupStoreSubscriptions();

    this.setupEmitterHandlers();

    garageService.getTotalCount().then(
      (count) => {
        garageStore.setState({ totalCarsCount: Number(count ?? 0) });
      },
      () => null
    );

    super.connectedCallback();
  }

  protected disconnectedCallback(): void {
    this.trackController.deinitialize();

    for (const unsubscribe of this.unsubscribeFunctions) {
      unsubscribe();
    }

    this.unsubscribeFunctions.clear();
  }

  private setupEmitterHandlers(): void {
    const unsubscribeCreatedOne = garageEmitter.on('garage:created-one', () => {
      garageService.getTotalCount().then(
        (count) => {
          garageStore.setState({ totalCarsCount: Number.parseInt(count ?? '0') });
        },
        () => null
      );
    });

    const unsubscribeCreatedHundred = garageEmitter.on('garage:created-hundred', () => {
      garageService.getTotalCount().then(
        (count) => {
          garageStore.setState({ totalCarsCount: Number.parseInt(count ?? '0') });
        },
        () => null
      );
    });

    this.unsubscribeFunctions.add(unsubscribeCreatedOne).add(unsubscribeCreatedHundred);
  }

  private setupStoreSubscriptions(): void {
    const unsubscribe = garageStore.subscribe(
      (state) => state,
      ({ currentPage, totalCarsCount }) => {
        garageService.getAll({ page: currentPage }).then(
          (cars) => {
            this.trackController.updateView(cars);

            this.pagination.setState({
              page: currentPage,
              totalPages: Math.ceil(totalCarsCount / CARS_PER_PAGE),
            });

            this.totalCarsSpan.textContent = totalCarsCount.toString();
          },
          () => null
        );
      }
    );

    this.unsubscribeFunctions.add(unsubscribe);
  }
}

defineElement('garage-page', GaragePage);
