import type { WinnersService } from '../../services/winners-service/winners.service';

import { CarImage } from '../car-image/car-image';
import { TableController } from './table.controller';

const mockGetAll = vi.fn();
vi.mock('../../services/service-provider.ts', () => ({
  serviceProvider: { winnersService: (): Partial<WinnersService> => ({ getAll: mockGetAll }) },
}));

describe(TableController.name, () => {
  it('getTableHeaders marks sortable fields and sorted ASC', () => {
    const controller = new TableController();
    const headers = controller.getTableHeaders(['id', 'name'], 'id', 'ASC');

    expect(headers).toEqual([
      { key: 'id', sortable: true, sorted: 'ASC' },
      { key: 'name', sortable: false, sorted: undefined },
    ]);
  });

  it('getTableHeaders marks sorted DESC', () => {
    const controller = new TableController();
    const headers = controller.getTableHeaders(['wins'], 'wins', 'DESC');

    expect(headers[0].sorted).toBe('DESC');
  });

  it('loadWinners returns empty arrays when no data', async () => {
    mockGetAll.mockResolvedValueOnce([]);
    const controller = new TableController();
    const result = await controller.loadWinners('ASC', 'id', 1);

    expect(result).toEqual({ headers: [], rows: [] });
  });

  it('loadWinners maps data to headers and rows', async () => {
    mockGetAll.mockResolvedValueOnce([{ color: 'red', id: 1, name: 'Alexey', wins: 3 }]);
    const controller = new TableController();
    const result = await controller.loadWinners('ASC', 'wins', 1);

    expect(result.headers.some((h) => h.key === 'wins' && h.sorted === 'ASC')).toBe(true);

    const row = result.rows[0];
    expect(row.cells.find((c) => c.kind === 'text' && c.value === 'Alexey')).toBeTruthy();
    expect(row.cells.find((c) => c.kind === 'img' && c.value instanceof CarImage)).toBeTruthy();
  });
});
