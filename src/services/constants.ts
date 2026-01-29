export const API_BASE_URL = 'http://127.0.0.1:3000';

export const API_ENDPOINT = {
  ENGINE: '/engine',
  GARAGE: '/garage',
  GARAGE_ID: (id: number) => `/garage/${id.toString()}`,
  WINNERS: '/winners',
  WINNERS_ID: (id: number) => `/winners/${id.toString()}`,
} as const;
