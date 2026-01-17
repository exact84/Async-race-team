import type { HttpClient } from '../../shared/http-client/http-client';
import type { Car, GetAllOptions } from './types';

import { isEmptyObject } from '../../shared/type-guards';
import { API_ENDPOINT } from '../constants';
import { buildApiUrl, extractTotalCountHeader } from '../utilities';
import { isCar, isCarsArray } from './type-guards';
import { createRandomCar } from './utilities';

const DEFAULT_LIMIT = 7;
const DEFAULT_PAGE = 1;
const DEFAULT_RANDOM_CARS_AMOUNT = 100;

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
      signal,
      typeGuard: isCar,
      url: buildApiUrl(API_ENDPOINT.GARAGE),
    });
  }

  public createRandomCars(
    amount = DEFAULT_RANDOM_CARS_AMOUNT,
    signal?: AbortSignal
  ): Promise<Car[]> {
    const promises = Array.from({ length: amount }, () => this.create(createRandomCar(), signal));

    return Promise.all(promises);
  }

  public delete(id: number, signal?: AbortSignal): Promise<object> {
    return this.http.delete({
      signal,
      typeGuard: isEmptyObject,
      url: buildApiUrl(API_ENDPOINT.GARAGE_ID(id), { id }),
    });
  }

  public get(id: number, signal?: AbortSignal): Promise<Car> {
    return this.http.get({
      signal,
      typeGuard: isCar,
      url: buildApiUrl(API_ENDPOINT.GARAGE_ID(id), { id }),
    });
  }

  public getAll(options: GetAllOptions = {}): Promise<Car[]> {
    const { limit = DEFAULT_LIMIT, page = DEFAULT_PAGE, signal } = options;

    return this.http.get({
      signal,
      typeGuard: isCarsArray,
      url: buildApiUrl(API_ENDPOINT.GARAGE, { _limit: limit, _page: page }),
    });
  }

  public getTotalCount(signal?: AbortSignal): Promise<null | string> {
    return this.http
      .head({ path: buildApiUrl(API_ENDPOINT.GARAGE, { _limit: DEFAULT_LIMIT }), signal })
      .then(extractTotalCountHeader);
  }

  public update(id: number, body: Omit<Car, 'id'>, signal?: AbortSignal): Promise<Car> {
    return this.http.put({
      body: { color: body.color, id, name: body.name },
      signal,
      typeGuard: isCar,
      url: buildApiUrl(API_ENDPOINT.GARAGE_ID(id), { id }),
    });
  }
}
