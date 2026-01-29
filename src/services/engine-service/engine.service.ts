import type { DriveMetrics, DriveResult, EngineStatus } from './types';

import { type HttpClient } from '../../shared/http-client/http-client';
import { API_ENDPOINT } from '../constants';
import { buildApiUrl } from '../utilities';
import { isDriveMetrics, isDriveResult } from './type-guards';

export class EngineService {
  private static instance: EngineService | null = null;

  private http: HttpClient;

  private constructor(http: HttpClient) {
    this.http = http;
  }

  public static getInstance(http: HttpClient): EngineService {
    this.instance ??= new EngineService(http);

    return this.instance;
  }

  public drive(id: number, signal?: AbortSignal): Promise<DriveResult> {
    return this.http.patch({
      signal,
      typeGuard: isDriveResult,
      url: buildApiUrl(API_ENDPOINT.ENGINE, { id, status: 'drive' }),
    });
  }

  public toggle(id: number, status: EngineStatus, signal?: AbortSignal): Promise<DriveMetrics> {
    return this.http.patch({
      signal,
      typeGuard: isDriveMetrics,
      url: buildApiUrl(API_ENDPOINT.ENGINE, { id, status }),
    });
  }
}
