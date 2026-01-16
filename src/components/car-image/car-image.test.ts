import { getByTestId } from '@testing-library/dom';

import { render } from '../../../__mocks__/test-utilities';
import { CAR_IMAGE_SIZE, CarImage } from './car-image';

describe(CarImage.name, () => {
  it('should render to DOM', () => {
    const carImage = render(() => new CarImage({ color: 'red' }));

    expect(carImage).toBeInTheDocument();
  });

  it('setColor() should change color of image', () => {
    const firstColor = 'red';
    const secondColor = 'blue';

    const carImage = render(() => new CarImage({ color: firstColor }));

    const icon = getByTestId(carImage, 'car-icon');

    expect(icon.style.backgroundColor).toBe(firstColor);

    carImage.setColor(secondColor);

    expect(icon.style.backgroundColor).toBe(secondColor);
  });

  it('should set default size', () => {
    const carImage = render(() => new CarImage({ color: 'red' }));

    const icon = getByTestId(carImage, 'car-icon');

    expect(icon.classList.contains(CAR_IMAGE_SIZE.sm)).toBe(true);
  });

  it('should set passed size', () => {
    const carImage = render(() => new CarImage({ color: 'red', size: 'lg' }));

    const icon = getByTestId(carImage, 'car-icon');

    expect(icon.classList.contains(CAR_IMAGE_SIZE.lg)).toBe(true);
  });
});
