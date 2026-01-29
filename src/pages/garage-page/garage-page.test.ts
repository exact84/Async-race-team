import { screen } from '@testing-library/dom';
import { type Mock, vi } from 'vitest';

import { render } from '../../../__mocks__/test-utilities';
import { garageStore } from '../../app/store/garage-store';
import { toastService } from '../../components/toast/toast.service';
import { serviceProvider } from '../../services/service-provider';
import { GaragePage } from './garage-page';

describe('GaragePage', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders static content', () => {
    const page = new GaragePage();
    document.body.append(page.render());

    expect(screen.getByText('Garage:')).toBeInTheDocument();
  });

  it('calls garageService.getTotalCount and updates garageStore', async () => {
    const getTotalCountSpy = vi
      .spyOn(serviceProvider.garageService(), 'getTotalCount')
      .mockResolvedValue('42');

    const page = new GaragePage();
    document.body.append(page.render());
    page.connectedCallback();

    await Promise.resolve();

    expect(getTotalCountSpy).toHaveBeenCalled();
  });

  it('shows toast if getTotalCount fails', async () => {
    const toastSpy = vi.spyOn(toastService, 'show');
    vi.spyOn(serviceProvider.garageService(), 'getTotalCount').mockRejectedValue(new Error('fail'));

    const page = new GaragePage();
    document.body.append(page.render());
    page.connectedCallback();

    await Promise.resolve();

    expect(toastSpy).toHaveBeenCalledWith({
      message: 'Failed to get total count of cars',
      timeout: 5000,
      type: 'error',
    });
  });
});

it('unsubscribes on disconnectedCallback', () => {
  const unsubscribeSpy = vi.fn();
  const originalSubscribe = garageStore.subscribe.bind(garageStore);
  garageStore.subscribe = (): Mock => unsubscribeSpy;

  const page = render(() => new GaragePage());

  page.connectedCallback();

  page.disconnectedCallback();

  expect(unsubscribeSpy).toHaveBeenCalled();

  garageStore.subscribe = originalSubscribe;
});
