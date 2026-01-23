import { div, header } from '@ripetchor/dom';
import { Router } from '@ripetchor/r-router';

import { NAV_LINKS } from '../components/navbar/nav-links';
import { Navbar } from '../components/navbar/navbar';
import { ThemeSwitcher } from '../components/theme-switcher/theme-switcher';
import { ToastContainer } from '../components/toast/toast';
import { toastService } from '../components/toast/toast.service';
import styles from './app.module.css';
import { ROUTES } from './routes';

export class App {
  private root = div({ className: styles.app });

  private router = new Router(ROUTES);

  public initialize(): void {
    this.router.initialize().then(
      (outlet) => {
        const navbar = new Navbar({ links: NAV_LINKS });

        const themeSwitcher = new ThemeSwitcher({
          onChange: (v): void => {
            document.documentElement.dataset.theme = v;
          },
          selectedTheme: 'dark',
        });

        const appHeader = header({ className: styles.header }, navbar, themeSwitcher);

        this.root.append(appHeader, outlet);

        document.body.append(this.root);

        const toastContainer = new ToastContainer();
        document.body.append(toastContainer);
      },
      () => {
        toastService.show({ message: 'App initialization failed', type: 'error' });
      }
    );
  }
}
