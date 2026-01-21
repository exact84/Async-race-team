/* eslint-disable max-lines-per-function */
import { fireEvent, screen } from '@testing-library/dom';
import { describe, expect, it, vi } from 'vitest';

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

    expect(screen.getByText('Winners page')).toBeInTheDocument();
  });

  it('calls loadWinners on connectedCallback', () => {
    mockLoadWinners.mockResolvedValueOnce({ headers: [], rows: [] });
    const page = new WinnersPage();
    document.body.append(page.render());

    page.connectedCallback();

    expect(mockLoadWinners).toHaveBeenCalledWith('ASC', expect.anything(), 1);
  });

  it('handleSort toggles order when same field clicked', async () => {
    mockLoadWinners.mockResolvedValue({ headers: [], rows: [] });
    const page = new WinnersPage();
    document.body.append(page.render());

    page.currentSort = 'wins';
    page.currentOrder = 'ASC';

    await page.handleSort('wins');

    expect(page.currentOrder).toBe('DESC');
    expect(mockLoadWinners).toHaveBeenCalledWith('DESC', 'wins', 1);
  });

  it('handleSort changes sort field when different', async () => {
    mockLoadWinners.mockResolvedValue({ headers: [], rows: [] });
    const page = new WinnersPage();
    document.body.append(page.render());

    page.currentSort = 'id';
    page.currentOrder = 'ASC';

    await page.handleSort('wins');

    expect(page.currentSort).toBe('wins');
    expect(page.currentOrder).toBe('ASC');
    expect(mockLoadWinners).toHaveBeenCalledWith('ASC', 'wins', 1);
  });

  it('button click triggers handleSort', () => {
    mockLoadWinners.mockResolvedValue({ headers: [], rows: [] });
    const page = new WinnersPage();
    document.body.append(page.render());

    const button = screen.getByText('Refresh');
    fireEvent.click(button);

    expect(mockLoadWinners).toHaveBeenCalled();
  });
});
