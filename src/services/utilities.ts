import { API_BASE_URL } from './constants';

export function buildApiUrl(
  endpoint: string,
  queryParameters?: Record<string, number | string>
): string {
  const url = `${API_BASE_URL}${endpoint}`;

  const searchParameters = new URLSearchParams();

  if (queryParameters) {
    const entries = Object.entries(queryParameters);

    for (const [name, value] of entries) {
      searchParameters.append(name, value.toString());
    }
  }

  return searchParameters.size > 0 ? `${url}?${searchParameters}` : url;
}

export function extractTotalCountHeader(headers: Headers): null | string {
  return headers.get('X-Total-Count');
}
