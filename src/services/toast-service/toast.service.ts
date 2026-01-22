import { type Toast, toastStore } from '../../app/toast-store/toast-store';

export class ToastService {
  private store = toastStore;

  public add(toast: Omit<Toast, 'id'>): void {
    const id = this.generateId();
    const newToast: Toast = { id, ...toast };
    this.store.setState((previous) => ({ toasts: [...previous.toasts, newToast] }));
    if (toast.timeout) {
      setTimeout(() => {
        this.remove(id);
      }, toast.timeout);
    }
  }

  public clearAll(): void {
    this.store.setState({ toasts: [] });
  }

  public remove(id: string): void {
    this.store.setState((previous) => ({ toasts: previous.toasts.filter((t) => t.id !== id) }));
  }

  private generateId(): string {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return Math.random().toString(36).slice(2);
  }
}

export const toastService = new ToastService();
