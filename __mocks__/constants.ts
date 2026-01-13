export const TEST_URL = 'http://127.0.0.1:3000';

export const TEST_ENDPOINT = {
  ENGINE: '/engine',
  GARAGE: '/garage',
  GARAGE_ID: (id: number) => `/garage/${id.toString()}`,
  WINNERS: '/winners',
  WINNERS_ID: (id: number) => `/winners/${id.toString()}`,
} as const;
