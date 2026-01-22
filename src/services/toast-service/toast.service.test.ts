/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable max-lines-per-function */
import { toastStore } from '../../app/toast-store/toast-store';
import { toastService } from './toast.service';
describe('ToastService subscribe', () => {
  beforeEach(() => {
    toastStore.setState({ toasts: [] }, { flush: 'sync' });
  });

  it('add new toast', () => {
    const unsubscribe = toastStore.subscribe(
      (state) => state.toasts,
      (toasts) => {
        expect(toasts.length).toBe(1);
        expect(toasts[0].message).toBe('Hello');
        expect(toasts[0].type).toBe('success');
        unsubscribe();
      }
    );

    toastService.add({ message: 'Hello', type: 'success' });
  });

  it('remove tosts by id', () => {
    let added = false;

    const unsubscribe = toastStore.subscribe(
      (state) => state.toasts,
      (toasts) => {
        if (!added && toasts.length === 1) {
          added = true;
          toastService.remove(toasts[0].id);
        } else if (added && toasts.length === 0) {
          expect(toasts).toEqual([]);
          unsubscribe();
        }
      }
    );

    toastService.add({ message: 'Bye', type: 'error' });
  });

  it('clearAll clears all tosts', () => {
    const unsubscribe = toastStore.subscribe(
      (state) => state.toasts,
      (toasts) => {
        if (toasts.length === 0) {
          expect(toasts).toEqual([]);
          unsubscribe();
        }
      }
    );

    toastService.add({ message: 'One', type: 'info' });
    toastService.add({ message: 'Two', type: 'success' });

    setTimeout(() => {
      toastService.clearAll();
    }, 0);
  });

  it('toast with timeout disappears automatically', () => {
    const TEST_TIME = 1000;
    vi.useFakeTimers();

    const unsubscribe = toastStore.subscribe(
      (state) => state.toasts,
      (toasts) => {
        if (toasts.length === 0) {
          expect(toasts).toEqual([]);
          unsubscribe();
          vi.useRealTimers();
        }
      }
    );

    toastService.add({ message: 'Temp', timeout: TEST_TIME, type: 'info' });

    vi.advanceTimersByTime(TEST_TIME);
  });
});

import { App } from '../../app/app';

describe('App + ToastService integration', () => {
  let app: App;
  let container: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `<div id="toast-container"></div>`;
    container = document.querySelector('#toast-container')!;
    app = new App();
    app.initialize();
  });

  it('render toasts to DOM through subscribe', async () => {
    toastService.add({ message: 'Hello', type: 'success' });

    await Promise.resolve();

    const toastElement = container.querySelector('.toast.success');
    expect(toastElement).toBeTruthy();
    expect(toastElement?.textContent).toContain('Hello');
  });
});
