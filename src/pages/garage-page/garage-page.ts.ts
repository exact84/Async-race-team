import { div, h1 } from '@ripetchor/dom';

import { Component, defineElement } from '../../shared/component/component';

// pages/garage-page/garge-page.ts
export class GaragePage extends Component {
  public render(): HTMLElement {
    return div({ className: 'page' }, h1(null, 'Garage page'));
  }
}

defineElement('garage-page', GaragePage);
