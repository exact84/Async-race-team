import { http, HttpResponse } from 'msw';

import type { WinnerRecord, WinnerWithCarData } from './types';

import { TEST_ENDPOINT } from '../../../__mocks__/constants';
import {
  MOCK_CARS_ARRAY,
  MOCK_SINGLE_WINNER_RECORD,
  MOCK_WINNER_RECORDS_ARRAY,
} from '../../../__mocks__/data';
import { server } from '../../../__mocks__/node';
import { buildTestUrl } from '../../../__mocks__/test-utilities';
import { serviceProvider } from '../service-provider';

const winnersService = serviceProvider.winnersService();

const MOCK_CARS_MAP = new Map(MOCK_CARS_ARRAY.map((car) => [car.id, car]));

const MOCK_MAPPED_RECORDS: WinnerWithCarData[] = MOCK_WINNER_RECORDS_ARRAY.map((record) => {
  const car = MOCK_CARS_MAP.get(record.id);

  if (!car) {
    throw new Error(`Car with id ${record.id.toString()} not found`);
  }

  return { color: car.color, id: record.id, name: car.name, time: record.time, wins: record.wins };
});

describe(winnersService.getAll.name, () => {
  it('returns winner records array', async () => {
    server.use(
      http.get(buildTestUrl(TEST_ENDPOINT.WINNERS), () => {
        return HttpResponse.json(MOCK_MAPPED_RECORDS);
      })
    );

    const response = await winnersService.getAll();

    expect(response).toEqual(MOCK_MAPPED_RECORDS);
  });
});

describe(winnersService.get.name, () => {
  it('returns single winner record', async () => {
    const id = 2;
    const response = await winnersService.get(id);

    expect(response).toEqual(MOCK_SINGLE_WINNER_RECORD);
  });

  it('throws error if record not found', async () => {
    const id = 555;

    await expect(winnersService.get(id)).rejects.toThrow();
  });
});

describe(winnersService.create.name, () => {
  it('creates new record', async () => {
    const newRecord: WinnerRecord = { id: 555, time: 1, wins: 1 };

    const response = await winnersService.create(newRecord);

    expect(response).toEqual(newRecord);
  });
});

describe(winnersService.delete.name, () => {
  it('deletes record', async () => {
    const response = await winnersService.delete(0);

    expect(response).toEqual({});
  });

  it('throws error if record not found', async () => {
    const id = 555;

    await expect(winnersService.delete(id)).rejects.toThrow();
  });
});

describe(winnersService.upsert.name, () => {
  it('updates existing record', async () => {
    const id = 2;

    const updateSpy = vi.spyOn(winnersService, 'update');

    const response = await winnersService.upsert(id, { time: 2, wins: 2 });

    expect(response).toEqual({ id, time: 2, wins: 3 });

    expect(updateSpy).toBeCalled();

    updateSpy.mockRestore();
  });

  it('creates record if it does not exist', async () => {
    const id = 555;

    const createSpy = vi.spyOn(winnersService, 'create');

    await expect(winnersService.upsert(id, { time: 2, wins: 2 })).resolves.toEqual({
      id,
      time: 2,
      wins: 2,
    });

    expect(createSpy).toBeCalled();

    createSpy.mockRestore();
  });

  it('throws error if record not found', async () => {
    const id = 555;

    await expect(winnersService.delete(id)).rejects.toThrow();
  });
});

describe(winnersService.getTotalCount.name, () => {
  it('returns total count header', async () => {
    const count = await winnersService.getTotalCount();

    expect(count).toBe(MOCK_WINNER_RECORDS_ARRAY.length.toString());
  });
});
