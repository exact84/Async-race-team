import { http, HttpResponse, type DefaultBodyType } from 'msw';

import { MOCK_CARS_ARRAY, MOCK_ENGINE_STATE } from './data';

const TEST_URL = 'http://127.0.0.1:3000';

export const TEST_ENDPOINT = {
  ENGINE: '/engine',
  GARAGE: '/garage',
  GARAGE_ID: (id: number) => `/garage/${id.toString()}`,
  WINNERS: '/winners',
  WINNERS_ID: (id: number) => `/winners/${id.toString()}`,
} as const;

export function buildTestUrl(
  endpoint: string,
  queryParameters?: Record<string, number | string>
): string {
  const url = `${TEST_URL}${endpoint}`;

  const searchParameters = new URLSearchParams();

  if (queryParameters) {
    const entries = Object.entries(queryParameters);

    for (const [name, value] of entries) {
      searchParameters.append(name, value.toString());
    }
  }

  const finalUrl = searchParameters.size > 0 ? `${url}?${searchParameters}` : url;

  return finalUrl;
}

export const handlers = [
  http.get(TEST_URL + '/garage', () => {
    return HttpResponse.json(MOCK_CARS_ARRAY);
  }),

  http.get(TEST_URL + '/garage/:id', ({ params }) => {
    return HttpResponse.json(MOCK_CARS_ARRAY.find((car) => car.id === Number(params.id)));
  }),

  http.head(TEST_URL + '/garage', () => {
    return HttpResponse.json(null, { headers: { 'mock-header': 'mock-header' } });
  }),

  http.delete(TEST_URL + '/garage/:id', ({ params }) => {
    return HttpResponse.json(MOCK_CARS_ARRAY.filter((car) => car.id !== Number(params.id)));
  }),

  http.post(TEST_URL + '/garage', async ({ request }) => {
    const newPost = await request.clone().json();

    return HttpResponse.json(newPost);
  }),

  http.put(TEST_URL + '/garage/:id', async ({ request }) => {
    const newPost = await request.clone().json();

    return HttpResponse.json(newPost);
  }),

  http.patch(TEST_URL + '/garage/:id', () => {
    return HttpResponse.json(MOCK_ENGINE_STATE);
  }),
];
