import { CAR_BRANDS, CAR_MODELS } from './constants';
import { createRandomCar } from './utilities';

describe(createRandomCar.name, () => {
  it('should return an object with color and name', () => {
    const car = createRandomCar();

    expect(car).toHaveProperty('color');
    expect(car).toHaveProperty('name');
  });

  it('should generate a name containing a valid brand and model', () => {
    const car = createRandomCar();

    const brandMatch = CAR_BRANDS.some((brand) => car.name.startsWith(brand));
    expect(brandMatch).toBe(true);

    const modelMatch = CAR_MODELS.some((model) => car.name.endsWith(model));
    expect(modelMatch).toBe(true);
  });
});
