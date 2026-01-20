import { getByTestId } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { render } from '../../../__mocks__/test-utilities';
import { garageEmitter } from '../../app/garage-emitter/garage-emitter';
import { TrackControls } from './track-controls';

afterEach(() => {
  vi.restoreAllMocks();
});

it('should render to DOM', () => {
  const component = render(() => new TrackControls({ emitter: garageEmitter }));

  expect(component).toBeInTheDocument();
});

it('buttons should be in correct initial state', () => {
  const component = render(() => new TrackControls({ emitter: garageEmitter }));

  const buttonStart = getByTestId(component, 'button-track-start');
  const buttonStop = getByTestId(component, 'button-track-stop');
  const buttonCreateOne = getByTestId(component, 'button-track-create-1');
  const buttonCreateHundred = getByTestId(component, 'button-track-create-100');

  expect(buttonStop).toBeDisabled();
  expect(buttonStart).not.toBeDisabled();
  expect(buttonCreateOne).not.toBeDisabled();
  expect(buttonCreateHundred).not.toBeDisabled();
});

it('buttons should be in correct after race start', async () => {
  const user = userEvent.setup();

  const component = render(() => new TrackControls({ emitter: garageEmitter }));

  const buttonStart = getByTestId(component, 'button-track-start');
  const buttonStop = getByTestId(component, 'button-track-stop');
  const buttonCreateOne = getByTestId(component, 'button-track-create-1');
  const buttonCreateHundred = getByTestId(component, 'button-track-create-100');

  await user.click(buttonStart);

  expect(buttonStop).not.toBeDisabled();
  expect(buttonStart).toBeDisabled();
  expect(buttonCreateOne).toBeDisabled();
  expect(buttonCreateHundred).toBeDisabled();
});

it('buttons should be in correct state after setButtonsState call', () => {
  const component = render(() => new TrackControls({ emitter: garageEmitter }));

  const buttonStart = getByTestId(component, 'button-track-start');
  const buttonStop = getByTestId(component, 'button-track-stop');
  const buttonCreateOne = getByTestId(component, 'button-track-create-1');
  const buttonCreateHundred = getByTestId(component, 'button-track-create-100');

  component.setButtonsState({ createHundred: true, createOne: true, start: true, stop: true });

  expect(buttonStart).toBeDisabled();
  expect(buttonStop).toBeDisabled();
  expect(buttonCreateOne).toBeDisabled();
  expect(buttonCreateHundred).toBeDisabled();

  component.setButtonsState({ createHundred: false, createOne: false, start: false, stop: false });
});

it('start and stop button clicks triggers emitter', async () => {
  const user = userEvent.setup();

  const emitSpy = vi.spyOn(garageEmitter, 'emit');

  const component = render(() => new TrackControls({ emitter: garageEmitter }));

  const buttonStart = getByTestId(component, 'button-track-start');
  const buttonStop = getByTestId(component, 'button-track-stop');

  await user.click(buttonStart);

  expect(emitSpy).toBeCalledWith('race:start');

  await user.click(buttonStop);

  expect(emitSpy).toBeCalledWith('race:stop');
});
