import { CARS } from './constants';
import { createRandomCar } from './utilities';

describe(createRandomCar.name, () => {
  it('should return an object with color and name', () => {
    const car = createRandomCar();

    expect(car).toHaveProperty('color');
    expect(car).toHaveProperty('name');
  });

  it('should generate a name containing a valid brand and model', () => {
    const car = createRandomCar();

    const match = CARS.some(({ brand, models }) => {
      const brandMatch = car.name.startsWith(brand);
      const modelMatch = models.some((model) => car.name.endsWith(model));

      return brandMatch && modelMatch;
    });

    expect(match).toBe(true);
  });
});
