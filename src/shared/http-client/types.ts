import type { TypeGuard } from '../types';
import type { HTTP_REQUEST_METHOD } from './constants';

export interface BaseRequestOptions<T> {
  body?: unknown;
  headers?: HeadersInit;
  method: HttpRequestMethod;
  signal?: AbortSignal;
  typeGuard: TypeGuard<T>;
  url: string;
}

export type HttpRequestMethod = (typeof HTTP_REQUEST_METHOD)[keyof typeof HTTP_REQUEST_METHOD];

export type WithoutBodyRequestOptions<T> = Omit<BaseRequestOptions<T>, 'body' | 'method'>;

export type WithoutMethodRequestOptions<T> = Omit<BaseRequestOptions<T>, 'method'>;
