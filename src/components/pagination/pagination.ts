import { div } from '@ripetchor/dom';

import { Component, defineElement } from '../../shared/component/component';
import { createFragment } from '../../shared/utilities';
import { Button } from '../button/button';
import styles from './pagination.module.css';

interface PaginationProperties {
  onPageChange(page: number): void;
}

interface State {
  page: number;
  totalPages: number;
}

export class Pagination extends Component<PaginationProperties, State> {
  public constructor(properties: PaginationProperties) {
    super(properties);

    this.state = { page: 1, totalPages: 1 };

    this.className = styles.container;
  }

  public render(): DocumentFragment | HTMLElement {
    const { page, totalPages } = this.state;

    const isFirst = page <= 1;
    const isLast = page >= totalPages;

    const buttonPrevious = new Button({
      onClick: (): void => {
        this.goTo(page - 1);
      },
      textContent: '<',
    });

    buttonPrevious.toggleDisabled(isFirst);

    const buttonNext = new Button({
      onClick: (): void => {
        this.goTo(page + 1);
      },
      textContent: '>',
    });

    buttonNext.toggleDisabled(isLast);

    return createFragment(
      buttonPrevious,
      div({ className: styles.info }, `${page.toString()} / ${totalPages.toString()}`),
      buttonNext
    );
  }

  private goTo(page: number): void {
    if (page < 1 || page > this.state.totalPages) {
      return;
    }

    this.props.onPageChange(page);
  }
}

defineElement('pagination', Pagination);
