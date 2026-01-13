import type { TypeGuard } from '../types';
import type { BaseRequestOptions, HttpRequestMethod } from './types';

export function checkResponse(response: Response): Response {
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response;
}

export function extractHeaders(response: Response): Headers {
  return response.headers;
}

export function extractJson(response: Response): unknown {
  return response.json();
}

export function prepareHeaders(extra?: HeadersInit): HeadersInit {
  return Object.assign({ 'Content-Type': 'application/json' }, extra);
}

export function prepareOptions<T>(
  method: HttpRequestMethod,
  options: Omit<BaseRequestOptions<T>, 'method'>
): BaseRequestOptions<T> {
  return {
    body: options.body,
    headers: options.headers,
    method,
    path: options.path,
    signal: options.signal,
    typeGuard: options.typeGuard,
  };
}

export function validateJson<T>(typeGuard: TypeGuard<T>) {
  return function (json: unknown): T {
    if (!typeGuard(json)) {
      throw new Error('Validation failed');
    }

    return json;
  };
}
