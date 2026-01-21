import { fireEvent, getByTestId } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { MOCK_SINGLE_CAR } from '../../../__mocks__/data';
import { render } from '../../../__mocks__/test-utilities';
import { CarForm } from './car-form';

vi.mock('../../services/garage-service/utilities', () => {
  return { createRandomCar: vi.fn().mockReturnValue(MOCK_SINGLE_CAR) };
});

it('should render to DOM', () => {
  const component = render(() => new CarForm({ mode: 'create', onSubmit: vi.fn() }));

  expect(component).toBeInTheDocument();
});

it('mode:create - should fill inputs with random values', () => {
  const component = render(() => new CarForm({ mode: 'create', onSubmit: vi.fn() }));

  const inputName = getByTestId(component, 'input-car-name');
  const inputColor = getByTestId(component, 'input-car-color');

  expect(inputName).toHaveValue(MOCK_SINGLE_CAR.name);
  expect(inputColor).toHaveValue(MOCK_SINGLE_CAR.color);
});

it('mode:update - should fill inputs with passed values', () => {
  const component = render(
    () => new CarForm({ mode: 'update', onSubmit: vi.fn(), ...MOCK_SINGLE_CAR })
  );

  const inputName = getByTestId(component, 'input-car-name');
  const inputColor = getByTestId(component, 'input-car-color');

  expect(inputName).toHaveValue(MOCK_SINGLE_CAR.name);
  expect(inputColor).toHaveValue(MOCK_SINGLE_CAR.color);
});

it('should submit with user typed value', async () => {
  const user = userEvent.setup();

  const onSubmitMock = vi.fn();

  const component = render(() => new CarForm({ mode: 'create', onSubmit: onSubmitMock }));

  const inputName = getByTestId(component, 'input-car-name');
  const inputColor = getByTestId(component, 'input-car-color');
  const buttonSubmit = getByTestId(component, 'button-submit-car-form');

  await user.clear(inputName);
  await user.type(inputName, 'foo-bar');

  fireEvent.change(inputColor, { target: { value: '#ffffff' } });

  await user.click(buttonSubmit);

  expect(inputName).toHaveValue('foo-bar');
  expect(inputColor).toHaveValue('#ffffff');

  expect(onSubmitMock).toBeCalledWith({ color: '#ffffff', id: Number.NaN, name: 'foo-bar' });
});
