import { h1, img, main } from '@ripetchor/dom';

import { Component, defineElement } from '../../shared/component/component';
import styles from './not-found.module.css';

const GIF_URL =
  'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYng1NG00aGdld2x4bG0xdG84dWdtbGJ4dHF4Ymk4NTNvajA5Y3dtayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4SF6BV4jm0ftfSGP6b/giphy.gif';

export class NotFoundPage extends Component {
  public render(): DocumentFragment | HTMLElement {
    return main(
      { className: styles.page },
      h1(null, '404 — This Page Is Playing Hide and Seek'),
      img({ className: styles.gif, src: GIF_URL })
    );
  }
}

defineElement('not-found-page', NotFoundPage);
