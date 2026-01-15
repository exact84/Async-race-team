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
    const [brand, model] = car.name.split(' ');

    expect(CAR_BRANDS.includes(brand)).toBe(true);
    expect(CAR_MODELS.includes(model)).toBe(true);
  });
});
