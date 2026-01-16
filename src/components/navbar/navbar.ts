import { li, nav, ul } from '@ripetchor/dom';
import { RouterLink } from '@ripetchor/r-router';

import type { RouterLinkProperties } from './nav-links';

import { Component, defineElement } from '../../shared/component/component';
import styles from './navbar.module.css';

export interface NavbarProperties {
  links: RouterLinkProperties[];
}

export class Navbar extends Component<NavbarProperties> {
  public constructor(properties: NavbarProperties) {
    super(properties);
  }

  public render(): HTMLElement {
    return nav(
      { className: styles.nav },
      ul(
        { className: styles.ul },
        ...this.props.links.map((link) =>
          li({ className: styles.li }, new RouterLink({ ...link, className: styles.a }))
        )
      )
    );
  }
}

defineElement('navbar', Navbar);
