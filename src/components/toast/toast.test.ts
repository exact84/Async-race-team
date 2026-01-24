/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-empty-function */
import { screen } from '@testing-library/dom';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { toastStore } from '../../app/store/toast-store';
import { ToastContainer } from './toast';

vi.mock('../../app/toast-store/toast-store', () => ({
  toastStore: { getState: vi.fn(), setState: vi.fn(), subscribe: vi.fn() },
}));

vi.mock('../../shared/component/component', () => ({
  Component: class {
    public render(): HTMLElement {
      return document.createElement('div');
    }

    public setState(): void {}
  },
  defineElement: vi.fn(),
}));

interface MockToastStore {
  getState: Mock;
  setState: Mock;
  subscribe: Mock;
}

describe('ToastContainer', () => {
  let mockToastStore: MockToastStore;

  beforeEach((): void => {
    mockToastStore = toastStore as unknown as MockToastStore;

    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  afterEach((): void => {
    document.body.innerHTML = '';
  });

  it('render all toasts from store', (): void => {
    const mockToasts = [
      { id: '1', message: 'success success', type: 'success' },
      { id: '2', message: 'error error', type: 'error' },
    ];

    mockToastStore.getState.mockReturnValue({ toasts: mockToasts });

    const container = new ToastContainer();
    const element = container.render();
    document.body.append(element);

    expect(screen.getByText('success success')).toBeInTheDocument();
    expect(screen.getByText('error error')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('add CSS classes depends on toast type', (): void => {
    const mockToasts = [
      { id: '1', message: 'Test', type: 'success' },
      { id: '2', message: 'Test 2', type: 'info' },
    ];

    mockToastStore.getState.mockReturnValue({ toasts: mockToasts });
    const container = new ToastContainer();
    const element = container.render();

    const toastElements = element.querySelectorAll('[class*="toast"]');

    expect(toastElements[0].className).toContain('toast');
    expect(toastElements[0].className).toContain('success');
    expect(toastElements[1].className).toContain('toast');
    expect(toastElements[1].className).toContain('info');
  });
});
