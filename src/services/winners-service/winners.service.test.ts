import type { WinnerRecord } from './types';

import { MOCK_SINGLE_WINNER_RECORD, MOCK_WINNER_RECORDS_ARRAY } from '../../../__mocks__/data';
import { serviceProvider } from '../service-provider';

const winnersService = serviceProvider.winnersService();

describe(winnersService.getAll.name, () => {
  it('returns winner records array', async () => {
    const response = await winnersService.getAll();

    expect(response).toEqual(MOCK_WINNER_RECORDS_ARRAY);
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

    await expect(winnersService.upsert(id, { time: 2, wins: 2 })).rejects.toThrow();

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
