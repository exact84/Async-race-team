import { getByTestId } from '@testing-library/dom';

import { CAR_IMAGE_SIZE, CarImage } from './car-image';

describe(CarImage.name, () => {
  it('should render to DOM', () => {
    const carImage = new CarImage({ color: 'red' });
    document.body.append(carImage);

    expect(carImage).toBeInTheDocument();
  });

  it('setColor() should change color of image', () => {
    const firstColor = 'red';
    const secondColor = 'blue';

    const carImage = new CarImage({ color: firstColor });
    document.body.append(carImage);

    const icon = getByTestId(carImage, 'car-icon');

    expect(icon.style.backgroundColor).toBe(firstColor);

    carImage.setColor(secondColor);

    expect(icon.style.backgroundColor).toBe(secondColor);
  });

  it('should set default size', () => {
    const carImage = new CarImage({ color: 'red' });
    document.body.append(carImage);

    const icon = getByTestId(carImage, 'car-icon');

    expect(icon.classList.contains(CAR_IMAGE_SIZE.sm)).toBe(true);
  });

  it('should set passed size', () => {
    const carImage = new CarImage({ color: 'red', size: 'lg' });
    document.body.append(carImage);

    const icon = getByTestId(carImage, 'car-icon');

    expect(icon.classList.contains(CAR_IMAGE_SIZE.lg)).toBe(true);
  });
});
