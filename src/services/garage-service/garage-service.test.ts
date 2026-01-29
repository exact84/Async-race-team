import type { Car } from './types';

import { MOCK_CARS_ARRAY, MOCK_SINGLE_CAR } from '../../../__mocks__/data';
import { serviceProvider } from '../service-provider';

const garageService = serviceProvider.garageService();

describe(garageService.getAll.name, () => {
  it('returns cars array', async () => {
    const response = await garageService.getAll();

    expect(response).toEqual(MOCK_CARS_ARRAY);
  });
});

describe(garageService.get.name, () => {
  it('returns single single car', async () => {
    const id = 2;
    const response = await garageService.get(id);

    expect(response).toEqual(MOCK_SINGLE_CAR);
  });

  it('throws error if car not found', async () => {
    const id = 555;

    await expect(garageService.get(id)).rejects.toThrow();
  });
});

describe(garageService.create.name, () => {
  it('creates new car', async () => {
    const newCar: Car = { color: 'red', id: 555, name: 'Tesla' };

    const response = await garageService.create(newCar);

    expect(response).toEqual(newCar);
  });
});

describe(garageService.delete.name, () => {
  it('deletes car', async () => {
    const response = await garageService.delete(0);

    expect(response).toEqual({});
  });

  it('throws error if car not found', async () => {
    const id = 555;

    await expect(garageService.delete(id)).rejects.toThrow();
  });
});

describe(garageService.update.name, () => {
  it('updates existing car', async () => {
    const id = 2;

    const response = await garageService.update(id, { color: 'red', name: 'bugatti' });

    expect(response).toEqual({ color: 'red', id, name: 'bugatti' });
  });
});

describe(garageService.getTotalCount.name, () => {
  it('returns total count header', async () => {
    const count = await garageService.getTotalCount();

    expect(count).toBe(MOCK_CARS_ARRAY.length.toString());
  });
});
