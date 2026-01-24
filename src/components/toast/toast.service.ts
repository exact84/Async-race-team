import { type Toast, toastStore } from '../../app/store/toast-store';

export class ToastService {
  private store = toastStore;

  public clearAll(): void {
    this.store.setState({ toasts: [] });
  }

  public removeToast(id: string): void {
    this.store.setState((previous) => ({ toasts: previous.toasts.filter((t) => t.id !== id) }));
  }

  public show(toast: Omit<Toast, 'id'>): void {
    const id = crypto.randomUUID();
    const newToast: Toast = { id, ...toast };
    this.store.setState((previous) => ({ toasts: [...previous.toasts, newToast] }));
    toast.timeout ??= 5000;
    setTimeout(() => {
      this.removeToast(id);
    }, toast.timeout);
  }
}

export const toastService = new ToastService();
