import { div, h1 } from '@ripetchor/dom';

import { Button } from '../../components/button/button';
import { Component, defineElement } from '../../shared/component/component';

export class WinnersPage extends Component {
  public render(): HTMLElement {
    const button = new Button({
      buttonSize: 'md',
      onClick: (): void => {
        console.warn('Button clicked!');
      },
      onToggle: (): void => {
        console.warn('Button toggled!');
      },
      textContent: 'Click me',
    });

    return div({ className: 'page' }, h1(null, 'Winners page'), button);
  }
}

defineElement('winners-page', WinnersPage);
