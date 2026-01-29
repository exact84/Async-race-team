import type {
  BaseRequestOptions,
  WithoutBodyRequestOptions,
  WithoutMethodRequestOptions,
} from './types';

import { HTTP_REQUEST_METHOD } from './constants';
import {
  checkResponse,
  extractHeaders,
  extractJson,
  prepareHeaders,
  prepareOptions,
  validateJson,
} from './utilities';

export class HttpClient {
  public delete<T>(options: WithoutMethodRequestOptions<T>): Promise<T> {
    return this.request(prepareOptions(HTTP_REQUEST_METHOD.DELETE, options));
  }

  public get<T>(options: WithoutBodyRequestOptions<T>): Promise<T> {
    return this.request(prepareOptions(HTTP_REQUEST_METHOD.GET, options));
  }

  public head(options: {
    headers?: Headers;
    path: string;
    signal?: AbortSignal;
  }): Promise<Headers> {
    return fetch(options.path, {
      headers: options.headers,
      method: HTTP_REQUEST_METHOD.HEAD,
      signal: options.signal,
    })
      .then(checkResponse)
      .then(extractHeaders);
  }

  public patch<T>(options: WithoutMethodRequestOptions<T>): Promise<T> {
    return this.request(prepareOptions(HTTP_REQUEST_METHOD.PATCH, options));
  }

  public post<T>(options: WithoutMethodRequestOptions<T>): Promise<T> {
    return this.request(prepareOptions(HTTP_REQUEST_METHOD.POST, options));
  }

  public put<T>(options: WithoutMethodRequestOptions<T>): Promise<T> {
    return this.request(prepareOptions(HTTP_REQUEST_METHOD.PUT, options));
  }

  private request<T>(options: BaseRequestOptions<T>): Promise<T> {
    const requestInit: RequestInit = {
      body: options.body ? JSON.stringify(options.body) : null,
      headers: prepareHeaders(options.headers),
      method: options.method,
      signal: options.signal,
    };

    return fetch(options.url, requestInit)
      .then(checkResponse)
      .then(extractJson)
      .then(validateJson(options.typeGuard));
  }
}

export const httpClient = new HttpClient();
