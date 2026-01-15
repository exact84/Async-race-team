/* eslint-disable perfectionist/sort-objects */

import { MyButton } from '../../components/button/button';
import { defineElement } from '../../shared/base-component/base-component';
import styles from './winners-page.module.css';

export class WinnersPage {
  private root: HTMLDivElement;

  public constructor() {
    this.root = document.createElement('div');
    this.root.className = styles.page;
  }

  public render(): HTMLElement {
    const footer = document.createElement('div');
    footer.className = styles.footer;

    const tag = defineElement('close-button', MyButton);
    const okButton = document.createElement(tag);

    if (!(okButton instanceof MyButton)) {
      throw new TypeError('Unexpected element type');
    }

    okButton.setProps({
      label: 'Close',
      size: 'm',
      disabled: false,
      onClick(): void {
        console.warn('close button clicked');
      },
    });
    footer.append(okButton);
    this.root.append(footer);
    return this.root;
  }
}

export const winnersPage: HTMLElement = new WinnersPage().render();
