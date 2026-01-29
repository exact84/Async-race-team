/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { screen } from '@testing-library/dom';

import '../../components/toast/toast';
import { render } from '../../../__mocks__/test-utilities';
import { toastStore } from '../../app/store/toast-store';
import { ToastContainer } from '../../components/toast/toast';

describe('ToastContainer (real lifecycle)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    toastStore.setState({ toasts: [] });
  });

  it('render all toasts from store', async () => {
    toastStore.setState({
      toasts: [
        { id: '1', message: 'success success', type: 'success' },
        { id: '2', message: 'error error', type: 'error' },
      ],
    });

    render(() => new ToastContainer());

    await Promise.resolve();

    expect(screen.getByText('success success')).toBeInTheDocument();
    expect(screen.getByText('error error')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('add CSS classes depends on toast type', async () => {
    toastStore.setState({
      toasts: [
        { id: '1', message: 'Test', type: 'success' },
        { id: '2', message: 'Test 2', type: 'info' },
      ],
    });

    const element = render(() => new ToastContainer());

    await Promise.resolve();

    const toasts = element.querySelectorAll<HTMLElement>('[data-testid="toast"]');

    expect(toasts).toHaveLength(2);
    expect(toasts[0].dataset.type).toBe('success');
    expect(toasts[1].dataset.type).toBe('info');
  });

  it('removes toast on close button click', async () => {
    toastStore.setState({
      toasts: [
        { id: '1', message: 'First', type: 'success' },
        { id: '2', message: 'Second', type: 'info' },
      ],
    });

    const element = render(() => new ToastContainer());

    await Promise.resolve();

    let toasts = element.querySelectorAll<HTMLElement>('[data-testid="toast"]');
    expect(toasts).toHaveLength(2);

    const firstToast = toasts[0];
    const closeButton = firstToast.querySelector<HTMLElement>('[data-testid="toast-close"]');
    if (closeButton) closeButton.click();

    await Promise.resolve();
    await Promise.resolve();

    toasts = element.querySelectorAll<HTMLElement>('[data-testid="toast"]');

    expect(toasts).toHaveLength(1);
    expect(toasts[0].textContent).toContain('Second');
  });
});
