import { h1, main, span } from '@ripetchor/dom';

import type { SortField, SortOrder } from '../../services/winners-service/types';

import { winnersStore } from '../../app/store/winners-store';
import { Pagination } from '../../components/pagination/pagination';
import { Table } from '../../components/table/table';
import { TableController } from '../../components/table/table.controller';
import { toastService } from '../../components/toast/toast.service';
import { serviceProvider } from '../../services/service-provider';
import {
  DEFAULT_LIMIT,
  DEFAULT_SORT_FIELD,
  DEFAULT_SORT_ORDER,
} from '../../services/winners-service/winners.service';
import { Component, defineElement } from '../../shared/component/component';
import styles from './winners-page.module.css';

const winnersService = serviceProvider.winnersService();

export class WinnersPage extends Component {
  public currentOrder: SortOrder = DEFAULT_SORT_ORDER;

  public currentSort: SortField = DEFAULT_SORT_FIELD;

  protected readonly pagination: Pagination;

  protected tableController = new TableController();

  private table = new Table({
    fallbackMessage: 'Loading...',
    headers: [],
    records: [],
    testid: 'winners-table',
  });

  private readonly totalWinnersSpan = span(null);

  private unsubscribe: (() => void) | undefined = undefined;

  public constructor() {
    super();

    this.pagination = new Pagination({
      onPageChange: (currentPage): void => {
        winnersStore.setState({ currentPage });
      },
    });
  }

  public connectedCallback(): void {
    this.setupStoreSubscription();
    this.setTotalCount();
    super.connectedCallback();
  }

  public disconnectedCallback(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = undefined;
    }
  }

  public async getData(sort: SortField, order: SortOrder, page: number): Promise<void> {
    try {
      const { headers, rows } = await this.tableController.loadWinners(order, sort, page);
      this.table = new Table({
        fallbackMessage: 'No winners yet',
        headers,
        onSort: (field: SortField): void => {
          this.handleSort(field);
        },
        records: rows,
        stickyHeader: true,
        testid: 'winners-table',
      });
    } catch {
      toastService.show({ message: 'Failed to load winners', type: 'error' });
    }
    this.setState({});
  }

  public handleSort(field: SortField): void {
    if (this.currentSort === field) {
      this.currentOrder = this.currentOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.currentSort = field;
    }

    this.updatePage();
  }

  public render(): HTMLElement {
    return main(
      { className: styles.page },
      h1(null, 'Winners', this.totalWinnersSpan),
      this.pagination,
      this.table
    );
  }

  private setTotalCount(): void {
    winnersService
      .getTotalCount()
      .then((count) => {
        winnersStore.setState({ totalCount: Number.parseInt(count ?? '0') });
      })
      .catch(() => {
        toastService.show({ message: 'Failed to get total count of winners', type: 'error' });
      });
  }

  private setupStoreSubscription(): void {
    this.unsubscribe = winnersStore.subscribe(
      (state) => state,
      () => {
        this.updatePage();
      }
    );
  }

  private updatePage(): void {
    const { currentPage, totalCount } = winnersStore.getState();
    this.pagination.setState({
      page: currentPage,
      totalPages: Math.ceil(totalCount / DEFAULT_LIMIT),
    });

    this.totalWinnersSpan.textContent = `: ${totalCount.toString()}`;

    void this.getData(this.currentSort, this.currentOrder, currentPage);
  }
}

defineElement('winners-page', WinnersPage);
