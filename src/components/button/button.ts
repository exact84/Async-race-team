import { button } from '@ripetchor/dom';

import { Component, defineElement } from '../../shared/component/component';
import styles from './button.module.css';

export interface ButtonProperties {
  buttonSize?: ButtonSize;
  onClick?(): void;
  onToggle?(): void;
  testid?: string;
  textContent: string;
}

export type ButtonSize = 'lg' | 'md' | 'sm';

export class Button extends Component<ButtonProperties> {
  private abortController = new AbortController();

  private buttonElement = button(
    {
      'className': this.props.buttonSize
        ? styles.button + ' ' + styles[`button-${this.props.buttonSize}`]
        : styles.button,
      'click': () => this.props.onClick?.(),
      'data-testid': this.props.testid,
      'signal': this.abortController.signal,
      'toggle': () => this.props.onToggle?.(),
    },
    this.props.textContent
  );

  public constructor(properties: ButtonProperties) {
    super(properties);
  }

  public disconnectedCallback(): void {
    this.abortController.abort();
  }

  public render(): HTMLElement {
    return this.buttonElement;
  }

  public toggleDisabled(disabled: boolean): void {
    if (disabled) {
      this.buttonElement.setAttribute('disabled', '');
    } else {
      this.buttonElement.removeAttribute('disabled');
    }
  }
}

defineElement('button', Button);
