import { div, header } from '@ripetchor/dom';
import { Router } from '@ripetchor/r-router';

import { NAV_LINKS } from '../components/navbar/nav-links';
import { Navbar } from '../components/navbar/navbar';
import { ThemeSwitcher } from '../components/theme-switcher/theme-switcher';
import { ToastContainer } from '../components/toast/toast';
import { toastService } from '../components/toast/toast.service';
import { getFromLocalStorage, setToLocalStorage } from '../shared/local-storage';
import { isAppTheme } from '../shared/type-guards';
import styles from './app.module.css';
import { ROUTES } from './routes';

export class App {
  private root = div({ className: styles.app });

  private router = new Router(ROUTES);

  public initialize(): void {
    this.router.initialize().then(
      (outlet) => {
        const storedTheme = getFromLocalStorage('app-theme', isAppTheme, 'system');
        document.documentElement.dataset.theme = storedTheme;

        const navbar = new Navbar({ links: NAV_LINKS });

        const themeSwitcher = new ThemeSwitcher({
          onChange: (theme): void => {
            document.documentElement.dataset.theme = theme;
            setToLocalStorage('app-theme', theme);
          },
          selectedTheme: storedTheme,
        });

        const appHeader = header({ className: styles.header }, navbar, themeSwitcher);

        const toastContainer = new ToastContainer();

        this.root.append(appHeader, outlet);

        document.body.append(this.root, toastContainer);
      },
      () => {
        toastService.show({ message: 'App initialization failed', type: 'error' });
      }
    );
  }
}
