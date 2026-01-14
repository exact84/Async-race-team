import { http, HttpResponse } from 'msw';

import { TEST_URL } from './constants';
import { MOCK_CARS_ARRAY, MOCK_ENGINE_STATE } from './data';

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
    return HttpResponse.json(MOCK_ENGINE_STATE);
  }),
];
