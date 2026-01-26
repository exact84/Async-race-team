/* eslint-disable perfectionist/sort-classes */
/* eslint-disable perfectionist/sort-objects */
import type { SortField, SortOrder, WinnerWithCarData } from '../../services/winners-service/types';
import type { TableCell, TableHeader, TableRecord } from './table';

import { serviceProvider } from '../../services/service-provider';
import { CarImage } from '../car-image/car-image';

const COLOR_FIELD: keyof WinnerWithCarData = 'color';
const TIME_FIELD: keyof WinnerWithCarData = 'time';

export class TableController {
  private abortController = new AbortController();

  private winnersService = serviceProvider.winnersService();

  public getTableHeaders(
    headers: readonly string[],
    sort: SortField | undefined,
    order?: SortOrder
  ): TableHeader[] {
    const prettyHeaders = headers.map((key): TableHeader => {
      return {
        key: key === 'color' ? 'car' : key,
        sortable: this.isSortField(key),
        sorted:
          key === sort && order !== undefined ? (order === 'ASC' ? 'ASC' : 'DESC') : undefined,
        colSize: key === 'name' ? 'lg' : 'md',
      };
    });

    return prettyHeaders;
  }

  private isSortField(value: string): boolean {
    return ['id', 'time', 'wins'].includes(value);
  }

  public async loadWinners(
    order: SortOrder,
    sort: SortField | undefined,
    page = 1
  ): Promise<{ headers: TableHeader[]; rows: TableRecord[] }> {
    const WINNERS_COLUMNS = ['id', 'name', 'wins', 'time', 'color'] as const;

    const data: WinnerWithCarData[] = await this.winnersService.getAll({
      order,
      page,
      signal: this.abortController.signal,
      sort,
    });

    if (data.length === 0) return { headers: [], rows: [] };

    const headers = this.getTableHeaders(WINNERS_COLUMNS, sort, order);
    const rows: TableRecord[] = data.map((item) => this.mapRecordToCells(item, WINNERS_COLUMNS));

    return { headers, rows };
  }

  public mapRecordToCells<T extends object>(record: T, columns: readonly (keyof T)[]): TableRecord {
    const cells: TableCell[] = columns.map((key) => {
      const raw = record[key];
      switch (key) {
        case COLOR_FIELD: {
          return {
            kind: 'img',
            value: new CarImage({ color: String(raw), size: 'md' }),
            meta: { tooltip: String(raw) },
          };
        }
        case TIME_FIELD: {
          return { kind: 'text', value: `${String(raw)}s` };
        }

        default: {
          return { kind: 'text', value: String(raw) };
        }
      }
    });

    return { cells };
  }
}
