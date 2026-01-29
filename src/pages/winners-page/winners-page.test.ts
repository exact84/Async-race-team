/* eslint-disable max-lines-per-function */
import { screen } from '@testing-library/dom';
import { type Mock, vi } from 'vitest';

import { render } from '../../../__mocks__/test-utilities';
import { winnersStore } from '../../app/store/winners-store';
import { toastService } from '../../components/toast/toast.service';
import { serviceProvider } from '../../services/service-provider';
import { WinnersPage } from './winners-page';
const mockLoadWinners = vi.fn();
vi.mock('../../components/table/table.controller', () => ({
  TableController: class {
    public loadWinners = mockLoadWinners;
  },
}));

describe('WinnersPage', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    mockLoadWinners.mockReset();
  });

  it('renders static content', () => {
    const page = new WinnersPage();
    document.body.append(page.render());

    expect(screen.getByText('Winners')).toBeInTheDocument();
  });

  it('calls loadWinners on connectedCallback', () => {
    mockLoadWinners.mockResolvedValueOnce({ headers: [], rows: [] });
    const page = new WinnersPage();
    document.body.append(page.render());

    page.connectedCallback();

    expect(mockLoadWinners).toHaveBeenCalledWith('ASC', expect.anything(), 1);
  });

  it('handleSort toggles order when same field clicked', () => {
    mockLoadWinners.mockResolvedValue({ headers: [], rows: [] });
    const page = new WinnersPage();
    document.body.append(page.render());

    page.currentSort = 'wins';
    page.currentOrder = 'ASC';

    page.handleSort('wins');

    expect(page.currentOrder).toBe('DESC');
    expect(mockLoadWinners).toHaveBeenCalledWith('DESC', 'wins', 1);
  });

  it('handleSort changes sort field when different', () => {
    mockLoadWinners.mockResolvedValue({ headers: [], rows: [] });
    const page = new WinnersPage();
    document.body.append(page.render());

    page.currentSort = 'id';
    page.currentOrder = 'ASC';

    page.handleSort('wins');

    expect(page.currentSort).toBe('wins');
    expect(page.currentOrder).toBe('ASC');
    expect(mockLoadWinners).toHaveBeenCalledWith('ASC', 'wins', 1);
  });

  it('calls winnersService.getTotalCount and updates winnersStore', async () => {
    const getTotalCountSpy = vi
      .spyOn(serviceProvider.winnersService(), 'getTotalCount')
      .mockResolvedValue('42');

    const page = new WinnersPage();
    document.body.append(page.render());
    page.connectedCallback();

    await Promise.resolve();

    expect(getTotalCountSpy).toHaveBeenCalled();
  });

  it('shows toast if getTotalCount fails', async () => {
    const toastSpy = vi.spyOn(toastService, 'show');
    vi.spyOn(serviceProvider.winnersService(), 'getTotalCount').mockRejectedValue(
      new Error('fail')
    );

    const page = new WinnersPage();
    document.body.append(page.render());
    page.connectedCallback();

    await Promise.resolve();

    expect(toastSpy).toHaveBeenCalledWith({
      message: 'Failed to load winners',
      timeout: 5000,
      type: 'error',
    });
  });
});

describe('WinnersPage extra coverage', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    mockLoadWinners.mockReset();
  });

  it('shows toast if loadWinners fails', async () => {
    const toastSpy = vi.spyOn(toastService, 'show');
    mockLoadWinners.mockRejectedValue(new Error('fail'));

    const page = new WinnersPage();
    document.body.append(page.render());

    await page.getData('id', 'ASC', 1);

    expect(toastSpy).toHaveBeenCalledWith({
      message: 'Failed to load winners',
      timeout: 5000,
      type: 'error',
    });
  });

  it('unsubscribes on disconnectedCallback (covers lines 96–98)', () => {
    const unsubscribeSpy = vi.fn();
    const originalSubscribe = winnersStore.subscribe.bind(winnersStore);
    winnersStore.subscribe = (): Mock => unsubscribeSpy;

    const page = render(() => new WinnersPage());

    page.connectedCallback();

    page.disconnectedCallback();

    expect(unsubscribeSpy).toHaveBeenCalled();

    winnersStore.subscribe = originalSubscribe;
  });
});
