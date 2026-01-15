/* eslint-disable perfectionist/sort-objects */
import type { ButtonProperties } from './types';

import { Component } from '../../shared/base-component/base-component';
import styles from './button.module.css';

export class MyButton extends Component<ButtonProperties> {
  private button: HTMLButtonElement;

  public constructor(properties: ButtonProperties) {
    super(properties);

    this.button = document.createElement('button');
    this.button.addEventListener('click', () => {
      this.props.onClick();
    });
  }

  public render(): HTMLElement {
    const { label, disabled = false, size = 'm' } = this.props;
    this.button.className = `${styles.button} ${styles[`button-${size}`]}`;
    this.button.textContent = label;
    this.button.disabled = disabled;
    return this.button;
  }
}
