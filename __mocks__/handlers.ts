import { http, HttpResponse } from 'msw';

import { TEST_URL } from './constants';
import {
  MOCK_CARS_ARRAY,
  MOCK_STARTED_ENGINE_METRICS,
  MOCK_STOPPED_ENGINE_METRICS,
  MOCK_SUCCESS_DRIVE_RESULT,
} from './data';

export const handlers = [
  http.get(TEST_URL + '/garage', () => {
    return HttpResponse.json(MOCK_CARS_ARRAY);
  }),

  http.get(TEST_URL + '/garage/:id', ({ params }) => {
    return HttpResponse.json(MOCK_CARS_ARRAY.find((car) => car.id === Number(params.id)));
  }),

  http.head(TEST_URL + '/garage', () => {
    return new HttpResponse(null, { headers: { 'mock-header': 'mock-header' } });
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

  http.patch(TEST_URL + '/garage', () => {
    return HttpResponse.json(MOCK_STARTED_ENGINE_METRICS);
  }),

  http.patch(TEST_URL + '/engine', ({ request }) => {
    const url = new URL(request.url);

    const id = url.searchParams.get('id');
    const status = url.searchParams.get('status');

    const car = MOCK_CARS_ARRAY.find((car) => car.id === Number(id));

    if (!car) {
      return new HttpResponse(null, { status: 404 });
    }

    if (status === 'stopped') {
      const target = 0.5;

      return Math.random() < target
        ? HttpResponse.json(MOCK_STOPPED_ENGINE_METRICS)
        : new HttpResponse(null, { status: 500 });
    }

    if (status === 'drive') {
      return HttpResponse.json(MOCK_SUCCESS_DRIVE_RESULT);
    }

    return HttpResponse.json(MOCK_STARTED_ENGINE_METRICS);
  }),
];
