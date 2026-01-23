import { div, header } from '@ripetchor/dom';
import { Router } from '@ripetchor/r-router';

import { NAV_LINKS } from '../components/navbar/nav-links';
import { Navbar } from '../components/navbar/navbar';
import { type AppTheme, ThemeSwitcher } from '../components/theme-switcher/theme-switcher';
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
        const storedTheme = this.initTheme();

        const navbar = this.createNavbar();
        const themeSwitcher = this.createThemeSwitcher(storedTheme);

        const appHeader = this.createHeader(navbar, themeSwitcher);

        this.root.append(appHeader, outlet);

        const toastContainer = this.createToast();

        document.body.append(this.root, toastContainer);
      },
      () => {
        toastService.show({ message: 'App initialization failed', type: 'error' });
      }
    );
  }

  private createHeader(navbar: Navbar, themeSwitcher: ThemeSwitcher): HTMLElement {
    return header({ className: styles.header }, navbar, themeSwitcher);
  }

  private createNavbar(): Navbar {
    return new Navbar({ links: NAV_LINKS });
  }

  private createThemeSwitcher(selectedTheme: AppTheme): ThemeSwitcher {
    return new ThemeSwitcher({
      onChange: (theme): void => {
        document.documentElement.dataset.theme = theme;
        setToLocalStorage('app-theme', theme);
      },
      selectedTheme,
    });
  }

  private createToast(): ToastContainer {
    return new ToastContainer();
  }

  private initTheme(): AppTheme {
    const theme = getFromLocalStorage('app-theme', isAppTheme, 'system');

    document.documentElement.dataset.theme = theme;

    return theme;
  }
}
