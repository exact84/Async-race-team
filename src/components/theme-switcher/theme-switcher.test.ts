import { getByTestId } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { render } from '../../../__mocks__/test-utilities';
import { ThemeSwitcher } from './theme-switcher';

it('renders to DOM', () => {
  const component = render(() => new ThemeSwitcher({ onChange: vi.fn(), selectedTheme: 'system' }));

  expect(component).toBeInTheDocument();
});

it('should set as checked passed value', () => {
  const component = render(() => new ThemeSwitcher({ onChange: vi.fn(), selectedTheme: 'dark' }));

  const inputDark = getByTestId(component, 'input-dark');
  const inputLight = getByTestId(component, 'input-light');
  const inputSystem = getByTestId(component, 'input-system');

  expect(inputDark).toBeChecked();
  expect(inputLight).not.toBeChecked();
  expect(inputSystem).not.toBeChecked();
});

it('should call onChange callback with correct value', async () => {
  const user = userEvent.setup();

  const onChangeMock = vi.fn();

  const component = render(
    () => new ThemeSwitcher({ onChange: onChangeMock, selectedTheme: 'system' })
  );

  const inputDark = getByTestId(component, 'input-dark');
  const inputLight = getByTestId(component, 'input-light');
  const inputSystem = getByTestId(component, 'input-system');

  await user.click(inputDark);
  expect(onChangeMock).toBeCalledWith('dark');

  await user.click(inputLight);
  expect(onChangeMock).toBeCalledWith('light');

  await user.click(inputSystem);
  expect(onChangeMock).toBeCalledWith('system');
});
