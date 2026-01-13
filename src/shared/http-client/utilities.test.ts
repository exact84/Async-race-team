import type { BaseRequestOptions } from './types';

import { testTypeGuard } from '../../../__mocks__/test-utilities';
import {
  checkResponse,
  extractHeaders,
  extractJson,
  prepareHeaders,
  prepareOptions,
  validateJson,
} from './utilities';

describe(checkResponse.name, () => {
  it('returns response if OK', () => {
    const response = new Response(null, { status: 200 });
    const result = checkResponse(response);

    expect(result).toEqual(response);
  });

  it('throws error if response is not OK', () => {
    const response = new Response(null, { status: 400 });

    expect(() => checkResponse(response)).toThrow();
  });
});

describe(extractHeaders.name, () => {
  it('returns response headers', () => {
    const response = new Response(null, { headers: { 'x-test': 'test' } });
    const result = extractHeaders(response);

    expect(result.get('x-test')).toBe('test');
  });
});

describe(extractJson.name, () => {
  it('returns json data', async () => {
    const data = { age: 25, name: 'Lana' };
    const response = Response.json(data);
    const result = await extractJson(response);

    expect(result).toEqual(data);
  });
});

describe(prepareHeaders.name, () => {
  it('returns default content-type header', () => {
    const headers = prepareHeaders();

    expect(headers).toEqual({ 'Content-Type': 'application/json' });
  });

  it('merges extra headers', () => {
    const headers = prepareHeaders({ Authorization: 'Bearer token' });

    expect(headers).toEqual({
      'Authorization': 'Bearer token',
      'Content-Type': 'application/json',
    });
  });

  it('allows overriding content-type', () => {
    const headers = prepareHeaders({ 'Content-Type': 'text/plain' });
    expect(headers).toEqual({ 'Content-Type': 'text/plain' });
  });
});

describe(prepareOptions.name, () => {
  it('returns full request options with method', () => {
    const passGuard = testTypeGuard<string>(true);

    const options: Omit<BaseRequestOptions<string>, 'method'> = {
      body: 'data',
      headers: { A: '1' },
      path: '/test',
      signal: undefined,
      typeGuard: passGuard,
    };

    const result = prepareOptions('POST', options);

    expect(result).toEqual({
      body: 'data',
      headers: { A: '1' },
      method: 'POST',
      path: '/test',
      signal: undefined,
      typeGuard: passGuard,
    });
  });
});

describe(validateJson.name, () => {
  it('returns json if validation passed', () => {
    interface Foo {
      foo: string;
    }

    const passGuard = testTypeGuard(true);

    const value: Foo = { foo: 'foo' };

    const result = validateJson(passGuard)(value);

    expect(result).toEqual(value);
  });

  it('throws error if validation failed', () => {
    const failGuard = testTypeGuard(false);

    expect(() => validateJson(failGuard)('')).toThrow();
  });
});
