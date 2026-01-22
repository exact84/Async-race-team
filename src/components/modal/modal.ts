import { div, h2 } from '@ripetchor/dom';

import { toggleScroll } from '../../shared/utilities';
import { Button } from '../button/button';
import styles from './modal.module.css';

interface ModalProperties {
  title: string;
}

export class Modal {
  private readonly abortController = new AbortController();

  private readonly backdropElement = div({ className: styles.backdrop });

  private readonly buttonClose = new Button({ textContent: 'Close' });

  private readonly childrenElement = div({ className: styles.children });

  private readonly properties: ModalProperties;

  public constructor(properties: ModalProperties) {
    this.properties = properties;

    this.setupEventListeners();
  }

  public close(): void {
    this.abortController.abort();

    this.backdropElement.remove();

    toggleScroll(document.body, 'no-scroll', false);
  }

  public open(callback: () => HTMLElement): void {
    const modalHeader = div({ className: styles.modalHeader }, h2(null, this.properties.title));
    const modalFooter = div({ className: styles.modalFooter }, this.buttonClose);

    this.childrenElement.replaceChildren(modalHeader, callback(), modalFooter);

    this.backdropElement.replaceChildren(this.childrenElement);

    document.body.append(this.backdropElement);

    toggleScroll(document.body, 'no-scroll', true);
  }

  private setupEventListeners(): void {
    this.backdropElement.addEventListener(
      'click',
      (event) => {
        if (event.target === this.backdropElement) {
          this.close();
        }
      },
      { signal: this.abortController.signal }
    );

    this.buttonClose.addEventListener(
      'click',
      () => {
        this.close();
      },
      { signal: this.abortController.signal }
    );

    document.addEventListener(
      'keydown',
      (event) => {
        if (event.code === 'Escape') {
          this.close();
        }
      },
      { signal: this.abortController.signal }
    );
  }
}
