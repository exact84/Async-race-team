import { http, HttpResponse } from 'msw';

import { TEST_URL } from './constants';
import {
  MOCK_CARS_ARRAY,
  MOCK_STARTED_ENGINE_METRICS,
  MOCK_STOPPED_ENGINE_METRICS,
  MOCK_SUCCESS_DRIVE_RESULT,
  MOCK_WINNER_RECORDS_ARRAY,
} from './data';

export const handlers = [
  http.get(TEST_URL + '/garage', () => {
    return HttpResponse.json(MOCK_CARS_ARRAY);
  }),

  http.get(TEST_URL + '/garage/:id', ({ params, request }) => {
    const url = new URL(request.url);

    const queryId = url.searchParams.get('id');
    const parameterId = params.id;

    const car = MOCK_CARS_ARRAY.find(
      (car) => car.id === Number(queryId) || car.id === Number(parameterId)
    );

    if (!queryId || !car) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(car);
  }),

  http.head(TEST_URL + '/garage', () => {
    return new HttpResponse(null, {
      headers: { 'X-Total-Count': MOCK_CARS_ARRAY.length.toString() },
    });
  }),

  http.delete(TEST_URL + '/garage/:id', ({ params, request }) => {
    const url = new URL(request.url);

    const queryId = url.searchParams.get('id');
    const parameterId = params.id;

    const car = MOCK_CARS_ARRAY.find(
      (car) => car.id === Number(queryId) || car.id === Number(parameterId)
    );

    if (!car) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({});
  }),

  http.post(TEST_URL + '/garage', async ({ request }) => {
    const newCar = await request.clone().json();

    return HttpResponse.json(newCar);
  }),

  http.put(TEST_URL + '/garage/:id', async ({ params, request }) => {
    const updatedCar = await request.clone().json();

    const url = new URL(request.url);

    const queryId = url.searchParams.get('id');
    const parameterId = params.id;

    const car = MOCK_CARS_ARRAY.find(
      (car) => car.id === Number(queryId) || car.id === Number(parameterId)
    );

    if (!car) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(updatedCar);
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

  http.get(TEST_URL + '/winners', () => {
    return HttpResponse.json(MOCK_WINNER_RECORDS_ARRAY);
  }),

  http.get(TEST_URL + '/winners/:id', ({ params, request }) => {
    const url = new URL(request.url);

    const queryId = url.searchParams.get('id');
    const parameterId = params.id;

    const record = MOCK_WINNER_RECORDS_ARRAY.find(
      (record) => record.id === Number(queryId) || record.id === Number(parameterId)
    );

    if (!queryId || !record) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(record);
  }),

  http.post(TEST_URL + '/winners', async ({ request }) => {
    const newRecord = await request.clone().json();

    return HttpResponse.json(newRecord);
  }),

  http.delete(TEST_URL + '/winners/:id', ({ params, request }) => {
    const url = new URL(request.url);

    const queryId = url.searchParams.get('id');
    const parameterId = params.id;

    const record = MOCK_WINNER_RECORDS_ARRAY.find(
      (record) => record.id === Number(queryId) || record.id === Number(parameterId)
    );

    if (!record) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({});
  }),

  http.put(TEST_URL + '/winners/:id', async ({ params, request }) => {
    const updatedRecord = await request.clone().json();

    const url = new URL(request.url);

    const queryId = url.searchParams.get('id');
    const parameterId = params.id;

    const record = MOCK_WINNER_RECORDS_ARRAY.find(
      (record) => record.id === Number(queryId) || record.id === Number(parameterId)
    );

    if (!record) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(updatedRecord);
  }),

  http.head(TEST_URL + '/winners', () => {
    return new HttpResponse(null, {
      headers: { 'X-Total-Count': MOCK_WINNER_RECORDS_ARRAY.length.toString() },
    });
  }),
];
