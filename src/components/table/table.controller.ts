/* eslint-disable perfectionist/sort-classes */
/* eslint-disable perfectionist/sort-union-types */
/* eslint-disable perfectionist/sort-objects */
import type { SortField, SortOrder, WinnerWithCarData } from '../../services/winners-service/types';
import type { TableCell, TableHeader, TableRecord } from './table';

import { serviceProvider } from '../../services/service-provider';
import { CarImage } from '../car-image/car-image';

export const DEFAULT_LIMIT = 10;

export class TableController {
  private abortController = new AbortController();

  private winnersService = serviceProvider.winnersService();

  public getTableHeaders(
    headers: string[],
    sort: SortField | undefined,
    order?: SortOrder
  ): TableHeader[] {
    const prettyHeaders = headers.map((key): TableHeader => {
      return {
        key,
        sortable: this.isSortField(key),
        sorted:
          key === sort && order !== undefined ? (order === 'ASC' ? 'ASC' : 'DESC') : undefined,
        colSize: key === 'name' ? 'lg' : 'md',
      };
    });

    return prettyHeaders;
  }

  private isSortField(value: string): boolean {
    // or I need an enum ((
    return ['id', 'time', 'wins'].includes(value);
  }

  public async loadWinners(
    order: SortOrder,
    sort: SortField | undefined,
    page = 1
  ): Promise<{ headers: TableHeader[]; rows: TableRecord[] }> {
    const data: WinnerWithCarData[] = await this.winnersService.getAll({
      order,
      page,
      signal: this.abortController.signal,
      sort,
    });

    if (data.length === 0) return { headers: [], rows: [] };

    const headers = this.getTableHeaders(Object.keys(data[0]), sort, order);
    const rows: TableRecord[] = data.map((item) => this.mapRecordToCells<WinnerWithCarData>(item));

    return { headers, rows };
  }

  public mapRecordToCells<T extends object>(record: T): TableRecord {
    let value: string | HTMLElement;
    const cells: TableCell[] = Object.entries(record).map(([key, raw]) => {
      value = key === 'color' ? new CarImage({ color: String(raw), size: 'sm' }) : String(raw);

      return {
        kind: key === 'color' ? 'img' : 'text',
        value,
        meta: { tooltip: key === 'color' ? String(raw) : undefined },
      };
    });

    return { cells };
  }
}
