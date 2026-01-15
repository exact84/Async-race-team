import type { HttpClient } from '../../shared/http-client/http-client';
import type { Car, GetAllOptions } from './types';

import { isEmptyObject } from '../../shared/type-guards';
import { API_ENDPOINT } from '../constants';
import { buildApiUrl, extractTotalCountHeader } from '../utilities';
import { isCar, isCarsArray } from './type-guards';

const DEFAULT_LIMIT = 7;
const DEFAULT_PAGE = 1;

export class GarageService {
  private static instance: GarageService | null = null;

  private http: HttpClient;

  private constructor(http: HttpClient) {
    this.http = http;
  }

  public static getInstance(http: HttpClient): GarageService {
    this.instance ??= new GarageService(http);

    return this.instance;
  }

  public create(body: Omit<Car, 'id'>, signal?: AbortSignal): Promise<Car> {
    return this.http.post({
      body,
      path: buildApiUrl(API_ENDPOINT.GARAGE),
      signal,
      typeGuard: isCar,
    });
  }

  public delete(id: number, signal?: AbortSignal): Promise<object> {
    return this.http.delete({
      path: buildApiUrl(API_ENDPOINT.GARAGE_ID(id), { id }),
      signal,
      typeGuard: isEmptyObject,
    });
  }

  public get(id: number, signal?: AbortSignal): Promise<Car> {
    return this.http.get({
      path: buildApiUrl(API_ENDPOINT.GARAGE_ID(id), { id }),
      signal,
      typeGuard: isCar,
    });
  }

  public getAll(options: GetAllOptions = {}): Promise<Car[]> {
    const { limit = DEFAULT_LIMIT, page = DEFAULT_PAGE, signal } = options;

    return this.http.get({
      path: buildApiUrl(API_ENDPOINT.GARAGE, { _limit: limit, _page: page }),
      signal,
      typeGuard: isCarsArray,
    });
  }

  public getTotalCount(signal?: AbortSignal): Promise<null | string> {
    return this.http
      .head({ path: buildApiUrl(API_ENDPOINT.GARAGE, { _limit: DEFAULT_LIMIT }), signal })
      .then(extractTotalCountHeader);
  }

  public update(id: number, body: Omit<Car, 'id'>, signal?: AbortSignal): Promise<Car> {
    return this.http.put({
      body,
      path: buildApiUrl(API_ENDPOINT.GARAGE_ID(id), { id }),
      signal,
      typeGuard: isCar,
    });
  }
}
