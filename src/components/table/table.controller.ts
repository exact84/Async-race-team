/* eslint-disable perfectionist/sort-union-types */
/* eslint-disable perfectionist/sort-object-types */
/* eslint-disable perfectionist/sort-objects */
import type { SortField, SortOrder, WinnerWithCarData } from '../../services/winners-service/types';

import { generateWinners } from '../../../__mocks__/data';
import { serviceProvider } from '../../services/service-provider';
import { CarImage } from '../car-image/car-image';

export const DEFAULT_LIMIT = 10;
export const DEFAULT_SORT_ORDER = 'DESC';
export const DEFAULT_SORT_FIELD = 'id';

export interface TableRecord {
  cells: TableCell[];
}

interface TableCell {
  kind: 'img' | 'text';
  meta?: {
    align?: 'center' | 'left' | 'right';
    className?: string;
    sortable?: boolean;
    tooltip?: string;
    color?: string;
    size?: 'sm' | 'md' | 'lg';
  };
  value: HTMLElement | number | string;
}

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
  ): Promise<{ headers: string[]; rows: TableRecord[] }> {
    let data: WinnerWithCarData[] = await this.winnersService.getAll({
      limit,
      order,
      page,
      signal: this.abortController.signal,
      sort,
    });
    // data = [];
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    data = generateWinners(50);
    if (data.length === 0) return { headers: [], rows: [] };

    const headers = this.getTableHeaders(Object.keys(data[0]));

    const rows: TableRecord[] = data.map((item) => ({
      cells: [
        {
          kind: 'img',
          value: new CarImage({ color: item.color, size: 'sm' }),
          meta: { tooltip: item.color, color: item.color, size: 'sm' },
        },
        { kind: 'text', value: item.id, meta: { sortable: true } },
        { kind: 'text', value: item.name, meta: { sortable: true } },
        { kind: 'text', value: item.time, meta: { sortable: true } },
        { kind: 'text', value: item.wins, meta: { sortable: true } },
      ],
    }));

    return { headers, rows };
  }
}

// function makeColorSvg(color: string): string {
//   return `data:image/svg+xml;utf8,
//     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
//     <circle cx="10" cy="10" r="8" fill="${color}"/></svg>`;
// }
