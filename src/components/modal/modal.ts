import { div } from '@ripetchor/dom';

import styles from './modal.module.css';

// interface ModalProperties {
//   title: string;
// }

export class Modal {
  private readonly backdropElement = div({ className: styles.backdrop });

  private readonly childrenElement = div({ className: styles.children });

  public close(): void {
    this.backdropElement.remove();
  }

  public open(callback: () => HTMLElement): void {
    this.childrenElement.replaceChildren(callback());

    this.backdropElement.replaceChildren(this.childrenElement);

    document.body.append(this.backdropElement);
  }
}
