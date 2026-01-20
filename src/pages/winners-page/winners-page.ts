/* eslint-disable perfectionist/sort-classes */
import { div, h1 } from '@ripetchor/dom';

import type { SortField, SortOrder } from '../../services/winners-service/types';

import { Button } from '../../components/button/button';
import { Table } from '../../components/table/table';
import { Component, defineElement } from '../../shared/component/component';
import {
  DEFAULT_LIMIT,
  DEFAULT_SORT_FIELD,
  WinnersPageController,
} from './winners-page.controller';

export class WinnersPage extends Component {
  private table = new Table({
    fallbackMessage: 'Loading...',
    headers: [],
    records: [],
    testid: 'winners-table',
  });

  private winnersPageController = new WinnersPageController();

  private currentOrder: SortOrder = 'ASC';

  private currentSort: SortField = DEFAULT_SORT_FIELD;

  private async handleSort(field: SortField): Promise<void> {
    if (this.currentSort === field) {
      this.currentOrder = this.currentOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.currentSort = field;
    }
    console.warn('Sorting by:', this.currentSort, this.currentOrder);

    await this.getData(this.currentSort, this.currentOrder);
  }

  public connectedCallback(): void {
    super.connectedCallback();
    void this.getData();
  }

  public render(): HTMLElement {
    const button = new Button({
      buttonSize: 'md',
      onClick: (): void => {
        console.warn('Button clicked!');
      },
      onToggle: (): void => {
        console.warn('Button toggled!');
      },
      textContent: 'Return to Garage',
    });
    return div({ className: 'page' }, h1(null, 'Winners page'), this.table, button);
  }

  private async getData(
    sort: SortField = DEFAULT_SORT_FIELD,
    order: SortOrder = 'ASC'
  ): Promise<void> {
    try {
      const { headers, rows } = await this.winnersPageController.loadWinners(
        DEFAULT_LIMIT,
        order,
        1,
        sort
      );
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
}

defineElement('winners-page', WinnersPage);
