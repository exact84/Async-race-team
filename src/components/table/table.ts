/* eslint-disable perfectionist/sort-interfaces */
import { caption, table, tbody, td, th, thead, tr } from '@ripetchor/dom';

import { Component, defineElement } from '../../shared/component/component';
import styles from './table.module.css';

export interface TableProperties {
  onClick?(): void;
  onSort?(field: string): void;
  stickyHeader?: boolean;
  testid: string;
  headers: string[];
  records: string[][];
  fallbackMessage?: string;
}

export class Table extends Component<TableProperties> {
  private abortController = new AbortController();

  public render(): HTMLElement {
    return table(
      {
        'className': styles.table,
        'click': () => this.props.onClick?.(),
        'data-testid': this.props.testid,
        'signal': this.abortController.signal,
      },
      ...(this.props.records.length > 0
        ? [
            thead(
              {
                className: this.props.stickyHeader
                  ? `${styles.thead} ${styles.sticky}`
                  : styles.thead,
              },
              ...this.props.headers.map((header) =>
                th({ className: styles.th, click: () => this.props.onSort?.(header) }, header)
              )
            ),
            tbody(
              { className: styles.tbody },
              ...this.props.records.map((record) =>
                tr(
                  { className: styles.tr },
                  ...record.map((cell) => td({ className: styles.td }, cell))
                )
              )
            ),
          ]
        : [caption({ className: styles.fallbackMessage }, this.props.fallbackMessage)])
    );
  }
}

defineElement('table', Table);
