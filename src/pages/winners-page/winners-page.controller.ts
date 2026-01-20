import type { SortField, SortOrder, WinnerWithCarData } from '../../services/winners-service/types';

import { serviceProvider } from '../../services/service-provider';

export const DEFAULT_LIMIT = 10;
export const DEFAULT_SORT_ORDER = 'DESC';
export const DEFAULT_SORT_FIELD = 'id';

export class WinnersPageController {
  private abortController = new AbortController();

  private winnersService = serviceProvider.winnersService();

  public getTableHeaders<T>(keys: (keyof T)[]): string[] {
    return keys.map((key) =>
      key
        .toString()
        .replaceAll(/([A-Z])/g, ' $1')
        .replace(/^./, (c) => c.toUpperCase())
    );
  }

  public async loadWinners(
    limit = DEFAULT_LIMIT,
    order: SortOrder = DEFAULT_SORT_ORDER,
    page = 1,
    sort: SortField = 'time'
  ): Promise<{ headers: string[]; rows: string[][] }> {
    const data: WinnerWithCarData[] = await this.winnersService.getAll({
      limit,
      order,
      page,
      signal: this.abortController.signal,
      sort,
    });
    // data = [];
    if (data.length === 0) return { headers: [], rows: [] };

    // const columnOrder: (keyof WinnerWithCarData)[] = ['name', 'wins', 'time'];

    const headers = this.getTableHeaders(Object.keys(data[0]));

    const rows = data.map((winner) => Object.values(winner).map(String));
    // const headers = ['ID', 'name', 'wins', 'time'];

    // const rows = Array.from({ length: 50 }, (_, index) => [
    //   String(index + 1),
    //   `User ${String(index + 1)}`,
    //   String(Math.floor(Math.random() * 100)),
    //   String(Math.floor(Math.random() * 100)),
    // ]);

    return { headers, rows };
  }
}
