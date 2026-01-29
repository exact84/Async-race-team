import type { HttpHandler } from 'msw';

import { http, HttpResponse, type PathParams } from 'msw';

export function createCrudHandlers<T extends { id: number }>(
  baseUrl: string,
  data: T[]
): HttpHandler[] {
  return [
    http.get(baseUrl, () => HttpResponse.json(data)),

    http.get(`${baseUrl}/:id`, ({ params, request }) => {
      const id = getId(params, request);
      const item = findById(data, id);

      return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 });
    }),

    http.post(baseUrl, async ({ request }) => {
      const body = await request.clone().json();

      return HttpResponse.json(body);
    }),

    http.put(`${baseUrl}/:id`, async ({ params, request }) => {
      const id = getId(params, request);
      const item = findById(data, id);

      if (!item) {
        return new HttpResponse(null, { status: 404 });
      }

      const body = await request.clone().json();

      return HttpResponse.json(body);
    }),

    http.delete(`${baseUrl}/:id`, ({ params, request }) => {
      const id = getId(params, request);
      const item = findById(data, id);

      return item ? HttpResponse.json({}) : new HttpResponse(null, { status: 404 });
    }),

    http.head(
      baseUrl,
      () => new HttpResponse(null, { headers: { 'X-Total-Count': data.length.toString() } })
    ),
  ];
}

export function findById<T extends { id: number }>(data: T[], id: null | number): T | undefined {
  if (id === null) {
    return undefined;
  }

  return data.find((item) => Object.is(item.id, id));
}

export function getId(parameters: PathParams, request: Request): null | number {
  const parameterId = parameters.id ? Number(parameters.id) : null;

  if (parameterId !== null && !Number.isNaN(parameterId)) {
    return parameterId;
  }

  const queryId = new URL(request.url).searchParams.get('id');

  const parsedQueryId = queryId ? Number(queryId) : null;

  if (parsedQueryId !== null && !Number.isNaN(parsedQueryId)) {
    return parsedQueryId;
  }

  return null;
}
