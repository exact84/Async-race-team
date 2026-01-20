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
  private abortController: AbortController | null = null;

  private readonly buttonNext = new Button({
    onClick: (): void => {
      this.goTo(this.state.page + 1);
    },
    textContent: '>',
  });

  private readonly buttonPrevious = new Button({
    onClick: (): void => {
      this.goTo(this.state.page - 1);
    },
    textContent: '<',
  });

  public constructor(properties: PaginationProperties) {
    super(properties);

    this.state = { page: 1, totalPages: 1 };

    this.className = styles.container;
  }

  public getAbortSignal(): AbortSignal {
    this.abortController ??= new AbortController();

    return this.abortController.signal;
  }

  public render(): DocumentFragment | HTMLElement {
    const { page, totalPages } = this.state;

    this.abortController?.abort();
    this.abortController = null;

    this.abortController = new AbortController();

    this.initializeButtonListeners();

    this.setButtonsState({ next: page >= totalPages, previous: page <= 1 });

    return createFragment(
      this.buttonPrevious,
      div({ className: styles.info }, `${page.toString()} / ${totalPages.toString()}`),
      this.buttonNext
    );
  }

  public setButtonsState(options: { next?: boolean; previous?: boolean }): void {
    const defaultValue = false;

    this.buttonNext.toggleDisabled(options.next ?? defaultValue);
    this.buttonPrevious.toggleDisabled(options.previous ?? defaultValue);
  }

  private goTo(page: number): void {
    if (page < 1 || page > this.state.totalPages) {
      return;
    }

    this.props.onPageChange(page);
  }

  private initializeButtonListeners(): void {
    this.buttonPrevious.addEventListener(
      'click',
      () => {
        this.goTo(this.state.page - 1);
      },
      { signal: this.getAbortSignal() }
    );

    this.buttonNext.addEventListener(
      'click',
      () => {
        this.goTo(this.state.page + 1);
      },

      { signal: this.getAbortSignal() }
    );
  }
}

defineElement('pagination', Pagination);
