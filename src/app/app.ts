import { div } from '@ripetchor/dom';
import { Router } from '@ripetchor/r-router';

import { NAV_LINKS } from '../components/navbar/nav-links';
import { Navbar } from '../components/navbar/navbar';
import { ROUTES } from './routes';

export class App {
  private root = div({ className: 'app' });

  private router = new Router(ROUTES);

  public initialize(): void {
    this.router.initialize().then(
      (outlet) => {
        const navbar = new Navbar({ links: NAV_LINKS });

        this.root.append(navbar, outlet);

        document.body.append(this.root);
      },
      () => {
        // TODO (ripetchor): replace by toast/snackbar
        console.warn('App initialization failed');
      }
    );
  }
}
