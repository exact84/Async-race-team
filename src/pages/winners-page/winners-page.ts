import { div, h1 } from '@ripetchor/dom';

import type { SortField, SortOrder } from '../../services/winners-service/types';

import { Table } from '../../components/table/table';
import { TableController } from '../../components/table/table.controller';
import {
  DEFAULT_SORT_FIELD,
  DEFAULT_SORT_ORDER,
} from '../../services/winners-service/winners.service';
import { Component, defineElement } from '../../shared/component/component';

export class WinnersPage extends Component {
  public currentOrder: SortOrder = 'ASC';

  public currentSort: SortField = DEFAULT_SORT_FIELD;

  private table = new Table({
    fallbackMessage: 'Loading...',
    headers: [],
    records: [],
    testid: 'winners-table',
  });

  private tableController = new TableController();

  public connectedCallback(): void {
    super.connectedCallback();
    void this.getData();
  }

  public async getData(
    sort: SortField = DEFAULT_SORT_FIELD,
    order: SortOrder = DEFAULT_SORT_ORDER
  ): Promise<void> {
    try {
      const { headers, rows } = await this.tableController.loadWinners(order, sort, 1);
      this.table = new Table({
        fallbackMessage: 'No winners yet',
        headers: headers,
        onSort: (field: SortField): void => {
          void this.handleSort(field);
        },
        records: rows,
        stickyHeader: true,
        testid: 'winners-table',
      });
    } catch (error) {
      // Replace with Toast
      console.error('Failed to load winners:', error);
    }
    this.setState({});
  }

  public async handleSort(field: SortField): Promise<void> {
    if (this.currentSort === field) {
      this.currentOrder = this.currentOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.currentSort = field;
    }

    await this.getData(this.currentSort, this.currentOrder);
  }

  public render(): HTMLElement {
    // const button = new Button({
    //   buttonSize: 'md',
    //   onClick: (): void => {
    //     void this.handleSort('wins');
    //   },
    //   textContent: 'Refresh',
    // });
    return div({ className: 'page' }, h1(null, 'Winners page'), this.table);
  }
}

defineElement('winners-page', WinnersPage);
