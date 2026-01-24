import type { HttpClient } from '../../shared/http-client/http-client';
import type { GarageService } from '../garage-service/garage.service';
import type { GetAllOptions, WinnerRecord, WinnerWithCarData } from './types';

import { isEmptyObject } from '../../shared/type-guards';
import { API_ENDPOINT } from '../constants';
import { buildApiUrl, extractTotalCountHeader } from '../utilities';
import { isWinnerRecord, isWinnerRecordsArray } from './type-guards';

export const DEFAULT_LIMIT = 5;
const DEFAULT_PAGE = 1;
export const DEFAULT_SORT_FIELD = 'id';
export const DEFAULT_SORT_ORDER = 'ASC';

export class WinnersService {
  private static instance: null | WinnersService = null;

  private readonly garageService;

  private http: HttpClient;

  private constructor(http: HttpClient, garageService: GarageService) {
    this.http = http;
    this.garageService = garageService;
  }

  public static getInstance(http: HttpClient, garageService: GarageService): WinnersService {
    this.instance ??= new WinnersService(http, garageService);

    return this.instance;
  }

  public create(body: WinnerRecord, signal?: AbortSignal): Promise<WinnerRecord> {
    return this.http.post({
      body,
      signal,
      typeGuard: isWinnerRecord,
      url: buildApiUrl(API_ENDPOINT.WINNERS),
    });
  }

  public delete(id: number, signal?: AbortSignal): Promise<object> {
    return this.http.delete({
      signal,
      typeGuard: isEmptyObject,
      url: buildApiUrl(API_ENDPOINT.WINNERS_ID(id), { id }),
    });
  }

  public get(id: number, signal?: AbortSignal): Promise<WinnerRecord> {
    return this.http.get({
      signal,
      typeGuard: isWinnerRecord,
      url: buildApiUrl(API_ENDPOINT.WINNERS_ID(id), { id }),
    });
  }

  public getAll(options: GetAllOptions = {}): Promise<WinnerWithCarData[]> {
    const {
      limit = DEFAULT_LIMIT,
      order = DEFAULT_SORT_ORDER,
      page = DEFAULT_PAGE,
      signal,
      sort = DEFAULT_SORT_FIELD,
    } = options;

    const url = buildApiUrl(API_ENDPOINT.WINNERS, {
      _limit: limit,
      _order: order,
      _page: page,
      _sort: sort,
    });

    return this.http.get({ signal, typeGuard: isWinnerRecordsArray, url }).then((records) => {
      return Promise.all(
        records.map((record) => {
          return this.garageService
            .get(record.id)
            .then((car) => ({
              color: car.color,
              id: record.id,
              name: car.name,
              time: record.time,
              wins: record.wins,
            }));
        })
      );
    });
  }

  public getTotalCount(signal?: AbortSignal): Promise<null | string> {
    return this.http
      .head({ path: buildApiUrl(API_ENDPOINT.WINNERS, { _limit: DEFAULT_LIMIT }), signal })
      .then(extractTotalCountHeader);
  }

  public has(id: number): Promise<boolean> {
    return this.get(id).then(
      () => true,
      () => false
    );
  }

  public update(record: WinnerRecord, signal?: AbortSignal): Promise<WinnerRecord> {
    return this.http.put({
      body: record,
      signal,
      typeGuard: isWinnerRecord,
      url: buildApiUrl(API_ENDPOINT.WINNERS_ID(record.id), { id: record.id }),
    });
  }

  public upsert(
    id: number,
    body: Omit<WinnerRecord, 'id'>,
    signal?: AbortSignal
  ): Promise<WinnerRecord> {
    return this.get(id, signal).then(
      (existing) => this.update(this.mergeRecords(existing, body)),
      () => this.create({ id, ...body }, signal)
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
