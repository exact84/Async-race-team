/* eslint-disable @typescript-eslint/dot-notation */
import { getByTestId } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { MOCK_SINGLE_CAR, MOCK_STOPPED_ENGINE_METRICS } from '../../../__mocks__/data';
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
    view.startAnimation();
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

it('onStartButtonClick should call pause on error', async () => {
  const user = userEvent.setup();
  const view = render(() => new CarView(MOCK_SINGLE_CAR));

  const pauseSpy = vi.spyOn(view, 'pause');

  view.setCallbacks({ ...mockCallbacks, onDrive: vi.fn().mockRejectedValue(new Error('fff')) });

  const buttonStart = getByTestId(view, 'button-start');
  await user.click(buttonStart);

  expect(pauseSpy).toBeCalled();
});

it('onDeleteButtonClick should restore buttons on error', async () => {
  const user = userEvent.setup();
  const view = render(() => new CarView(MOCK_SINGLE_CAR));

  view.setCallbacks({ ...mockCallbacks, onDelete: vi.fn().mockRejectedValue(new Error('fff')) });

  const buttonDelete = getByTestId(view, 'button-delete');
  await user.click(buttonDelete);

  expect(buttonDelete).not.toBeDisabled();
});

it('onUpdateButtonClick should update name and color', async () => {
  const user = userEvent.setup();
  const view = render(() => new CarView(MOCK_SINGLE_CAR));

  view.setCallbacks({
    ...mockCallbacks,
    onUpdate: vi.fn().mockResolvedValue({ color: 'red', id: 1, name: 'Updated' }),
  });

  const buttonUpdate = getByTestId(view, 'button-update');
  await user.click(buttonUpdate);

  expect(view.textContent).toContain('Updated');
});

it('disconnectedCallback should abort internal AbortController', () => {
  const view = render(() => new CarView(MOCK_SINGLE_CAR));

  const signal = view.getAbortSignal();
  expect(signal.aborted).toBe(false);

  view.remove();

  expect(signal.aborted).toBe(true);
});

it('onStopButtonClick should always restore buttons state', async () => {
  const user = userEvent.setup();
  const view = render(() => new CarView(MOCK_SINGLE_CAR));

  view.setCallbacks({
    ...mockCallbacks,
    onStop: vi.fn().mockResolvedValue(MOCK_STOPPED_ENGINE_METRICS),
  });

  const buttonStop = getByTestId(view, 'button-stop');
  const buttonStart = getByTestId(view, 'button-start');

  await user.click(buttonStop);

  expect(buttonStart).not.toBeDisabled();
  expect(buttonStop).toBeDisabled();
});

it('onUpdateButtonClick should exit early when callback returns undefined', async () => {
  const user = userEvent.setup();
  const view = render(() => new CarView(MOCK_SINGLE_CAR));

  view.setCallbacks({ ...mockCallbacks, onUpdate: vi.fn().mockResolvedValue(null) });

  const buttonUpdate = getByTestId(view, 'button-update');

  await user.click(buttonUpdate);

  expect(view.textContent).toContain(MOCK_SINGLE_CAR.name);
});

it('setCallbacks should store callbacks reference', () => {
  const view = render(() => new CarView(MOCK_SINGLE_CAR));

  view.setCallbacks(mockCallbacks);

  expect(view['callbacks']).toBe(mockCallbacks);
});
