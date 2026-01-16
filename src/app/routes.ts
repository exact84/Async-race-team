import { type Route } from '@ripetchor/r-router';

import type { GaragePage } from '../pages/garage-page/garage-page.ts';
import type { WinnersPage } from '../pages/winners-page/winners-page.ts';

export const ROUTES: Route[] = [
  {
    lazy: async (): Promise<GaragePage> => {
      const { GaragePage } = await import('../pages/garage-page/garage-page.ts');
      return new GaragePage();
    },
    path: '/garage',
    title: 'Garage',
  },
  {
    lazy: async (): Promise<WinnersPage> => {
      const { WinnersPage } = await import('../pages/winners-page/winners-page.ts');
      return new WinnersPage();
    },
    path: '/winners',
    title: 'Winners',
  },
  { path: '/', redirectTo: '/winners' },
];
