/* eslint-disable perfectionist/sort-interfaces */
import { caption, table, tbody, td, th, thead, tr } from '@ripetchor/dom';

import type { SortOrder } from '../../services/winners-service/types';

import { Component, defineElement } from '../../shared/component/component';
import { prettyHeader } from './helper';
import styles from './table.module.css';

export interface TableCell {
  kind: 'img' | 'text';
  meta?: { className?: string; color?: string; size?: 'lg' | 'md' | 'sm'; tooltip?: string };
  value: HTMLElement | number | string;
}

export interface TableHeader {
  key: string;
  sortable: boolean;
  sorted?: SortOrder;
}
export interface TableProperties {
  onClick?(): void;
  onSort?(field: string): void;
  stickyHeader?: boolean;
  testid: string;
  headers: TableHeader[];
  records: TableRecord[];
  fallbackMessage?: string;
}

export interface TableRecord {
  cells: TableCell[];
}

export class Table extends Component<TableProperties> {
  private abortController = new AbortController();

  public render(): HTMLElement {
    return table(
      {
        'className': styles.table,
        'data-testid': this.props.testid,
        'signal': this.abortController.signal,
      },
      ...(this.props.records.length > 0
        ? [this.createThead(), this.createTbody()]
        : [caption({ className: styles.fallbackMessage }, this.props.fallbackMessage)])
    );
  }

  private createTbody(): HTMLElement {
    return tbody(
      { className: styles.tbody },
      ...this.props.records.map((record) =>
        tr(
          { className: styles.tr },
          ...record.cells.map((cell) => td({ className: styles.td }, cell.value))
        )
      )
    );
  }

  private createThead(): HTMLElement {
    return thead(
      { className: styles.thead },
      ...this.props.headers.map((header) =>
        th(
          {
            className: styles.th,
            click: () => {
              if (!header.sortable) return;
              this.props.onSort?.(header.key);
            },
          },
          `${prettyHeader(header.key)}${header.sortable && header.sorted ? (header.sorted === 'ASC' ? ' ↑' : ' ↓') : ''}`
        )
      )
    );
  }
}

defineElement('table', Table);
