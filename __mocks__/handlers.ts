import { http, HttpResponse } from 'msw';

import { MOCK_CARS } from './data';

const API_URL = 'http://127.0.0.1:3000';

export const handlers = [
  http.get(API_URL + '/garage', () => {
    return HttpResponse.json(MOCK_CARS);
  }),
];
