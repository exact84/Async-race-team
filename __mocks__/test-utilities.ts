import { TEST_URL } from './constants';

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

export function render<T extends HTMLElement>(createComponent: () => T): T {
  const component = createComponent();

  document.body.append(component);

  return component;
}

export function testTypeGuard<T>(result: boolean) {
  return function (v: unknown): v is T {
    void v;

    return result;
  };
}
