import { TEST_ENDPOINT } from '../../../__mocks__/constants';
import { MOCK_CARS_ARRAY, MOCK_STARTED_ENGINE_METRICS } from '../../../__mocks__/data';
import { buildTestUrl, testTypeGuard } from '../../../__mocks__/test-utilities';
import { httpClient } from './http-client';

const passGuard = testTypeGuard(true);

describe(httpClient.get.name, () => {
  it('returns array of data', async () => {
    const response = await httpClient.get({
      typeGuard: passGuard,
      url: buildTestUrl(TEST_ENDPOINT.GARAGE),
    });

    expect(response).toEqual(MOCK_CARS_ARRAY);
  });

  it('returns single entity', async () => {
    const response = await httpClient.get({
      typeGuard: passGuard,
      url: buildTestUrl(TEST_ENDPOINT.GARAGE_ID(0), { id: 0 }),
    });

    expect(response).toEqual(MOCK_CARS_ARRAY[0]);
  });
});

describe(httpClient.head.name, () => {
  it('returns headers', async () => {
    const headers = await httpClient.head({ path: buildTestUrl(TEST_ENDPOINT.GARAGE) });

    expect(headers.get('X-Total-Count')).toBe(MOCK_CARS_ARRAY.length.toString());
  });
});

describe(httpClient.delete.name, () => {
  it('deletes entity', async () => {
    const response = await httpClient.delete({
      typeGuard: passGuard,
      url: buildTestUrl(TEST_ENDPOINT.GARAGE_ID(0)),
    });

    expect(response).toEqual({});
  });
});

describe(httpClient.post.name, () => {
  it('creates entity', async () => {
    const newCar = { color: 'red', name: 'Ferrari' };

    const response = await httpClient.post({
      body: newCar,
      typeGuard: passGuard,
      url: buildTestUrl(TEST_ENDPOINT.GARAGE),
    });

    expect(response).toEqual(newCar);
  });
});

describe(httpClient.put.name, () => {
  it('replaces entity', async () => {
    const newCar = { color: 'red', name: 'Ferrari' };

    const response = await httpClient.put({
      body: newCar,
      typeGuard: passGuard,
      url: buildTestUrl(TEST_ENDPOINT.GARAGE_ID(0)),
    });

    expect(response).toEqual(newCar);
  });
});

describe(httpClient.patch.name, () => {
  it('patches entity', async () => {
    const response = await httpClient.patch({
      typeGuard: passGuard,
      url: buildTestUrl(TEST_ENDPOINT.GARAGE),
    });

    expect(response).toEqual(MOCK_STARTED_ENGINE_METRICS);
  });
});
