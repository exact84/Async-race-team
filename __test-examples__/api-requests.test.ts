import { MOCK_CARS } from '../__mocks__/data';

describe('Garage', () => {
  it('should return cars', async () => {
    const response = await fetch('http://127.0.0.1:3000/garage');
    const cars: unknown = await response.json();

    expect(cars).toEqual(MOCK_CARS);
  });
});
