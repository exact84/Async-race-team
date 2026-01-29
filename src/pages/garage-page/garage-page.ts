import { div, h1, main, span } from '@ripetchor/dom';

import { garageEmitter } from '../../app/garage-emitter/garage-emitter';
import { garageStore } from '../../app/store/garage-store';
import { Pagination } from '../../components/pagination/pagination';
import { toastService } from '../../components/toast/toast.service';
import { TrackControls } from '../../components/track-controls/track-controls';
import { TrackController } from '../../features/track/track.controller';
import { TrackView } from '../../features/track/track.view';
import { serviceProvider } from '../../services/service-provider';
import { Component, defineElement } from '../../shared/component/component';
import styles from './garage-page.module.css';

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

  public override connectedCallback(): void {
    this.setupStoreSubscriptions();

    this.setupEmitterHandlers();

    this.setTotalCount();

    super.connectedCallback();
  }

  public disconnectedCallback(): void {
    this.trackController.deinitialize();

    for (const unsubscribe of this.unsubscribeFunctions) {
      unsubscribe();
    }

    this.unsubscribeFunctions.clear();
  }

  public render(): HTMLElement {
    const trackControls = new TrackControls({ emitter: garageEmitter });

    return main(
      { className: 'page' },
      h1(null, 'Garage: ', this.totalCarsSpan),
      div({ className: styles.controls }, trackControls, this.pagination),
      this.trackController.getView()
    );
  }

  private setTotalCount(): void {
    garageService.getTotalCount().then(
      (count) => {
        garageStore.setState({ totalCount: Number.parseInt(count ?? '0') });
      },
      () => {
        toastService.show({ message: 'Failed to get total count of cars', type: 'error' });
      }
    );
  }

  private setupEmitterHandlers(): void {
    const unsubscribeRaceStart = garageEmitter.on('race:start', () => {
      this.pagination.setButtonsState({ next: true, previous: true });
    });

    const unsubscribeRaceStopped = garageEmitter.on('race:stop', () => {
      this.pagination.setButtonsState({ next: false, previous: false });
    });

    const unsubscribeCreatedOne = garageEmitter.on('garage:created-one', () => {
      this.setTotalCount();
    });

    const unsubscribeCreatedHundred = garageEmitter.on('garage:created-hundred', () => {
      this.setTotalCount();
    });

    const unsubscribeDeleteCar = garageEmitter.on('garage:delete-car', () => {
      const { currentPage, totalCount } = garageStore.getState();

      this.updatePage(currentPage, totalCount);

      this.setTotalCount();
    });

    this.unsubscribeFunctions
      .add(unsubscribeRaceStart)
      .add(unsubscribeRaceStopped)
      .add(unsubscribeCreatedOne)
      .add(unsubscribeCreatedHundred)
      .add(unsubscribeDeleteCar);
  }

  private setupStoreSubscriptions(): void {
    const unsubscribe = garageStore.subscribe(
      (state) => state,
      ({ currentPage, totalCount }) => {
        this.updatePage(currentPage, totalCount);
      }
    );

    this.unsubscribeFunctions.add(unsubscribe);
  }

  private updatePage(currentPage: number, totalCount: number): void {
    const totalPages = Math.max(1, Math.ceil(totalCount / CARS_PER_PAGE));

    const normalizedPage = Math.min(currentPage, totalPages);

    if (normalizedPage !== currentPage) {
      garageStore.setState({ currentPage: normalizedPage });
      return;
    }

    this.pagination.setState({ page: normalizedPage, totalPages });

    this.totalCarsSpan.textContent = totalCount.toString();

    garageService.getAll({ page: normalizedPage }).then(
      (cars) => {
        this.trackController.updateView(cars);
      },
      () => {
        this.trackController.updateView([]);
        toastService.show({ message: 'Failed to get data', type: 'error' });
      }
    );
  }
}

defineElement('garage-page', GaragePage);
