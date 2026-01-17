import { ROUTES } from './routes';

function isLazyRoute(route: unknown): route is { lazy(context: unknown): Promise<HTMLElement> } {
  return typeof route === 'object' && route !== null && 'lazy' in route;
}

describe('ROUTES', () => {
  it('contains garage, winners and root routes', () => {
    const paths = ROUTES.map((r) => r.path);

    expect(paths).toContain('/garage');
    expect(paths).toContain('/winners');
    expect(paths).toContain('/');
  });

  it('lazy routes resolves a pages', async () => {
    for (const route of ROUTES) {
      if (isLazyRoute(route)) {
        const context = {
          from: '/',
          params: {},
          query: new URLSearchParams(),
          signal: new AbortController().signal,
          to: route.path,
        };

        const page = await route.lazy(context);
        expect(page).toBeInstanceOf(HTMLElement);
      }
    }
  });
});
