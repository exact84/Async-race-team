import { button, div } from '@ripetchor/dom';

import { toastStore } from '../../app/toast-store/toast-store';
import { Component, defineElement } from '../../shared/component/component';
import styles from './toast.module.css';

export class ToastContainer extends Component {
  public constructor() {
    super();
    toastStore.subscribe(
      (state) => state.toasts,
      () => {
        this.setState({});
      }
    );
  }

  public render(): HTMLElement {
    const toasts = toastStore.getState().toasts;
    return div(
      { className: styles['toast-container'], id: 'toast-container' },
      ...toasts.map((toast) =>
        div(
          { className: `${styles.toast} ${styles[toast.type]}` },
          toast.message,
          button(
            {
              className: styles.close,
              click: () => {
                toastStore.setState((s) => ({ toasts: s.toasts.filter((t) => t.id !== toast.id) }));
              },
            },
            '✖'
          )
        )
      )
    );
  }
}

defineElement('toast-container', ToastContainer);
