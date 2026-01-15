import type { HttpClient } from '../../shared/http-client/http-client';
import type { GetAllOptions, WinnerRecord } from './types';

import { isEmptyObject } from '../../shared/type-guards';
import { API_ENDPOINT } from '../constants';
import { buildApiUrl, extractTotalCountHeader } from '../utilities';
import { isWinnerRecord, isWinnerRecordsArray } from './type-guards';

const DEFAULT_LIMIT = 5;
const DEFAULT_PAGE = 1;
const DEFAULT_SORT_FIELD = 'id';
const DEFAULT_SORT_ORDER = 'ASC';

export class WinnersService {
  private static instance: null | WinnersService = null;

  private http: HttpClient;

  private constructor(http: HttpClient) {
    this.http = http;
  }

  public static getInstance(http: HttpClient): WinnersService {
    this.instance ??= new WinnersService(http);

    return this.instance;
  }

  public create(body: Omit<WinnerRecord, 'id'>, signal?: AbortSignal): Promise<WinnerRecord> {
    return this.http.post({
      body,
      path: buildApiUrl(API_ENDPOINT.WINNERS),
      signal,
      typeGuard: isWinnerRecord,
    });
  }

  public delete(id: number, signal?: AbortSignal): Promise<object> {
    return this.http.delete({
      path: buildApiUrl(API_ENDPOINT.WINNERS_ID(id), { id }),
      signal,
      typeGuard: isEmptyObject,
    });
  }

  public get(id: number, signal?: AbortSignal): Promise<WinnerRecord> {
    return this.http.get({
      path: buildApiUrl(API_ENDPOINT.WINNERS_ID(id), { id }),
      signal,
      typeGuard: isWinnerRecord,
    });
  }

  public getAll(options: GetAllOptions = {}): Promise<WinnerRecord[]> {
    const {
      limit = DEFAULT_LIMIT,
      order = DEFAULT_SORT_ORDER,
      page = DEFAULT_PAGE,
      signal,
      sort = DEFAULT_SORT_FIELD,
    } = options;

    return this.http.get({
      path: buildApiUrl(API_ENDPOINT.WINNERS, {
        _limit: limit,
        _order: order,
        _page: page,
        _sort: sort,
      }),
      signal,
      typeGuard: isWinnerRecordsArray,
    });
  }

  public getTotalCount(signal?: AbortSignal): Promise<null | string> {
    return this.http
      .head({ path: buildApiUrl(API_ENDPOINT.WINNERS, { _limit: DEFAULT_LIMIT }), signal })
      .then(extractTotalCountHeader);
  }

  public update(record: WinnerRecord, signal?: AbortSignal): Promise<WinnerRecord> {
    return this.http.put({
      body: record,
      path: buildApiUrl(API_ENDPOINT.WINNERS_ID(record.id), { id: record.id }),
      signal,
      typeGuard: isWinnerRecord,
    });
  }

  public upsert(
    id: number,
    body: Omit<WinnerRecord, 'id'>,
    signal?: AbortSignal
  ): Promise<WinnerRecord> {
    return this.get(id, signal).then(
      (existing) => this.update(this.mergeRecords(existing, body)),
      () => this.create(body, signal)
    );
  }

  private mergeRecords(existing: WinnerRecord, incoming: Omit<WinnerRecord, 'id'>): WinnerRecord {
    return {
      id: existing.id,
      time: Math.min(existing.time, incoming.time),
      wins: existing.wins + 1,
    };
  }
}
