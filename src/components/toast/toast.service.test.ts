/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable max-lines-per-function */
import { toastStore } from '../../app/toast-store/toast-store';
import { toastService } from './toast.service';
describe('ToastService subscribe', () => {
  beforeEach(() => {
    toastStore.setState({ toasts: [] }, { flush: 'sync' });
  });

  it('add new toast', () => {
    let unsubscribe: () => void = () => {};
    unsubscribe = toastStore.subscribe(
      (state) => state.toasts,
      (toasts) => {
        expect(toasts.length).toBe(1);
        expect(toasts[0].message).toBe('Hello');
        expect(toasts[0].type).toBe('success');
        unsubscribe();
      }
    );

    toastService.show({ message: 'Hello', type: 'success' });
  });

  it('remove tosts by id', () => {
    let added = false;
    let unsubscribe: () => void = () => {};
    unsubscribe = toastStore.subscribe(
      (state) => state.toasts,
      (toasts) => {
        if (!added && toasts.length === 1) {
          added = true;
          toastService.removeToast(toasts[0].id);
        } else if (added && toasts.length === 0) {
          expect(toasts).toEqual([]);
          unsubscribe();
        }
      }
    );

    toastService.show({ message: 'Bye', type: 'error' });
  });

  it('clearAll clears all tosts', () => {
    let unsubscribe: () => void = () => {};
    unsubscribe = toastStore.subscribe(
      (state) => state.toasts,
      (toasts) => {
        if (toasts.length === 0) {
          expect(toasts).toEqual([]);
          unsubscribe();
        }
      }
    );

    toastService.show({ message: 'One', type: 'info' });
    toastService.show({ message: 'Two', type: 'success' });

    setTimeout(() => {
      toastService.clearAll();
    }, 0);
  });
});
