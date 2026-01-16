import { http, HttpResponse } from 'msw';

import { TEST_URL } from './constants';
import {
  MOCK_CARS_ARRAY,
  MOCK_STARTED_ENGINE_METRICS,
  MOCK_STOPPED_ENGINE_METRICS,
  MOCK_SUCCESS_DRIVE_RESULT,
  MOCK_WINNER_RECORDS_ARRAY,
} from './data';
import { createCrudHandlers, findById, getId } from './handler-utilities';

export const handlers = [
  ...createCrudHandlers(TEST_URL + '/garage', MOCK_CARS_ARRAY),
  ...createCrudHandlers(TEST_URL + '/winners', MOCK_WINNER_RECORDS_ARRAY),

  http.patch(TEST_URL + '/garage', () => HttpResponse.json(MOCK_STARTED_ENGINE_METRICS)),

  http.patch(TEST_URL + '/engine', ({ request }) => {
    const id = getId({}, request);
    const car = findById(MOCK_CARS_ARRAY, id);

    if (!car) {
      return new HttpResponse(null, { status: 404 });
    }

    const status = new URL(request.url).searchParams.get('status');

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
