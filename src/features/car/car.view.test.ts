/* eslint-disable @typescript-eslint/dot-notation */
import { getByTestId } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { MOCK_SINGLE_CAR } from '../../../__mocks__/data';
import { render } from '../../../__mocks__/test-utilities';
import { CarView } from './car.view';

const mockCallbacks = { onDelete: vi.fn(), onDrive: vi.fn(), onStop: vi.fn(), onUpdate: vi.fn() };

afterEach(() => {
  vi.restoreAllMocks();
});

it('should render to DOM', () => {
  const view = render(() => new CarView(MOCK_SINGLE_CAR));

  expect(view).toBeInTheDocument();
});

it('should call onDrive callback when Start button is clicked', async () => {
  const user = userEvent.setup();
  const view = render(() => new CarView(MOCK_SINGLE_CAR));

  view.setCallbacks(mockCallbacks);

  const buttonStart = getByTestId(view, 'button-start');
  await user.click(buttonStart);

  expect(mockCallbacks.onDrive).toBeCalled();
});

it('should call onStop callback when Stop button is clicked', async () => {
  const user = userEvent.setup();
  const view = render(() => new CarView(MOCK_SINGLE_CAR));

  view.setCallbacks(mockCallbacks);

  const buttonStart = getByTestId(view, 'button-start');
  await user.click(buttonStart);

  const buttonStop = getByTestId(view, 'button-stop');
  await user.click(buttonStop);

  expect(mockCallbacks.onStop).toBeCalled();
});

it('should call onDelete callback when Delete button is clicked', async () => {
  const user = userEvent.setup();
  const view = render(() => new CarView(MOCK_SINGLE_CAR));

  view.setCallbacks(mockCallbacks);

  const buttonDelete = getByTestId(view, 'button-delete');
  await user.click(buttonDelete);

  expect(mockCallbacks.onDelete).toBeCalled();
});

it('should call onUpdate callback when Update button is clicked', async () => {
  const user = userEvent.setup();
  const view = render(() => new CarView(MOCK_SINGLE_CAR));

  view.setCallbacks(mockCallbacks);

  const buttonUpdate = getByTestId(view, 'button-update');
  await user.click(buttonUpdate);

  expect(mockCallbacks.onUpdate).toBeCalled();
});

it('Stop button should be disabled initially', () => {
  const view = render(() => new CarView(MOCK_SINGLE_CAR));

  view.setCallbacks(mockCallbacks);

  const buttonStop = getByTestId(view, 'button-stop');

  expect(buttonStop).toBeDisabled();
});

it('Start, Update and Delete buttons should be disabled after Start clicked', async () => {
  const user = userEvent.setup();
  const view = render(() => new CarView(MOCK_SINGLE_CAR));

  view.setCallbacks(mockCallbacks);

  const buttonStart = getByTestId(view, 'button-start');
  const buttonStop = getByTestId(view, 'button-stop');
  const buttonUpdate = getByTestId(view, 'button-update');
  const buttonDelete = getByTestId(view, 'button-delete');

  await user.click(buttonStart);

  expect(buttonStart).toBeDisabled();
  expect(buttonUpdate).toBeDisabled();
  expect(buttonDelete).toBeDisabled();
  expect(buttonStop).not.toBeDisabled();
});

it('Start, Update and Delete buttons should be enabled after Stop clicked', async () => {
  const user = userEvent.setup();
  const view = render(() => new CarView(MOCK_SINGLE_CAR));

  view.setCallbacks(mockCallbacks);

  const buttonStart = getByTestId(view, 'button-start');
  const buttonStop = getByTestId(view, 'button-stop');
  const buttonUpdate = getByTestId(view, 'button-update');
  const buttonDelete = getByTestId(view, 'button-delete');

  await user.click(buttonStart);

  await user.click(buttonStop);

  expect(buttonStart).not.toBeDisabled();
  expect(buttonUpdate).not.toBeDisabled();
  expect(buttonDelete).not.toBeDisabled();
  expect(buttonStop).toBeDisabled();
});

it('should handle drive without driveMetrics', () => {
  const view = render(() => new CarView(MOCK_SINGLE_CAR));

  expect(() => {
    view.drive();
  }).not.toThrow();
});

it('should toggle all buttons combinations in setButtonsState', () => {
  const view = render(() => new CarView(MOCK_SINGLE_CAR));
  view.setCallbacks(mockCallbacks);

  const buttonStart = getByTestId(view, 'button-start');
  const buttonStop = getByTestId(view, 'button-stop');
  const buttonUpdate = getByTestId(view, 'button-update');
  const buttonDelete = getByTestId(view, 'button-delete');

  view['setButtonsState']({ delete: true, start: false, stop: true, update: false });

  expect(buttonDelete).toBeDisabled();
  expect(buttonStart).not.toBeDisabled();
  expect(buttonStop).toBeDisabled();
  expect(buttonUpdate).not.toBeDisabled();
});
