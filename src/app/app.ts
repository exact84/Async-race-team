import { div } from '@ripetchor/dom';
import { Router } from '@ripetchor/r-router';

import { NAV_LINKS } from '../components/navbar/nav-links';
import { Navbar } from '../components/navbar/navbar';
import { toastService } from '../services/toast-service/toast.service';
import styles from './app.module.css';
import { ROUTES } from './routes';
import { toastStore } from './toast-store/toast-store';

export class App {
  private root = div({ className: styles.app });

  private router = new Router(ROUTES);

  public initialize(): void {
    toastStore.subscribe(
      (state) => state.toasts,
      (toasts) => {
        const container = document.querySelector('#toast-container');
        if (!container) return;

        container.innerHTML = '';
        for (const toast of toasts) {
          const element = document.createElement('div');
          element.className = `toast ${toast.type}`;
          element.textContent = toast.message;

          const closeButton = document.createElement('button');
          closeButton.className = 'close';
          closeButton.textContent = '✖';
          closeButton.addEventListener('click', () => {
            toastService.remove(toast.id);
          });

          element.append(closeButton);
          container.append(element);
        }
      }
    );
    this.router.initialize().then(
      (outlet) => {
        const navbar = new Navbar({ links: NAV_LINKS });

        this.root.append(navbar, outlet);

        document.body.append(this.root);
      },
      () => {
        toastService.add({ message: 'App initialization failed', type: 'error' });
      }
    );
  }
}
