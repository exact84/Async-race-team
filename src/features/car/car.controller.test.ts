import { MOCK_SINGLE_CAR, MOCK_STOPPED_ENGINE_METRICS } from '../../../__mocks__/data';
import { serviceProvider } from '../../services/service-provider';
import { CarController } from './car.controller';
import { CarView } from './car.view';

const engineService = serviceProvider.engineService();
const garageService = serviceProvider.garageService();

afterEach(() => {
  vi.restoreAllMocks();
});

it('getView returns view', () => {
  const view = new CarView({ car: MOCK_SINGLE_CAR, emitter: null });
  const controller = new CarController(view, engineService, garageService);

  expect(controller.getView()).toBeInstanceOf(CarView);
});

it('passes callbacks to view', () => {
  const view = new CarView({ car: MOCK_SINGLE_CAR, emitter: null });
  const setCallbacksSpy = vi.spyOn(view, 'setCallbacks');
  new CarController(view, engineService, garageService);

  expect(setCallbacksSpy).toBeCalled();
});

it('delete should call garageService.delete', async () => {
  const controller = new CarController(
    new CarView({ car: MOCK_SINGLE_CAR, emitter: null }),
    engineService,
    garageService
  );
  const spy = vi.spyOn(garageService, 'delete');

  await controller.delete();

  expect(spy).toBeCalled();
});

it('startEngine should call engineService.toggle', async () => {
  const view = new CarView({ car: MOCK_SINGLE_CAR, emitter: null });
  const controller = new CarController(view, engineService, garageService);

  const toggleSpy = vi.spyOn(engineService, 'toggle');

  await controller.startEngine(view.getAbortSignal());

  expect(toggleSpy).toBeCalledWith(MOCK_SINGLE_CAR.id, 'started', expect.any(AbortSignal));
});

it('drive should call startEngine and engineService.drive', async () => {
  const view = new CarView({ car: MOCK_SINGLE_CAR, emitter: null });
  const controller = new CarController(view, engineService, garageService);

  const driveSpy = vi.spyOn(engineService, 'drive');

  await controller.drive(view.getAbortSignal());

  expect(driveSpy).toBeCalledWith(MOCK_SINGLE_CAR.id, expect.any(AbortSignal));
});

it('stop should call engineService.toggle with', async () => {
  const view = new CarView({ car: MOCK_SINGLE_CAR, emitter: null });
  const controller = new CarController(view, engineService, garageService);

  const toggleSpy = vi.spyOn(engineService, 'toggle');
  toggleSpy.mockResolvedValue(MOCK_STOPPED_ENGINE_METRICS);

  await controller.stop();

  expect(toggleSpy).toBeCalled();
});

it('update should call garageService.update', async () => {
  const view = new CarView({ car: MOCK_SINGLE_CAR, emitter: null });
  const controller = new CarController(view, engineService, garageService);

  const updateSpy = vi.spyOn(garageService, 'update');

  await controller.update({ color: 'blue', name: 'new' });

  expect(updateSpy).toBeCalled();
});

it('drive recreates AbortController and aborts previous one', async () => {
  const view = new CarView({ car: MOCK_SINGLE_CAR, emitter: null });
  const controller = new CarController(view, engineService, garageService);

  const parentController = new AbortController();
  const driveSpy = vi.spyOn(engineService, 'drive');

  await controller.drive(parentController.signal);
  await controller.drive(parentController.signal);

  const expectedTimes = 2;
  expect(driveSpy).toHaveBeenCalledTimes(expectedTimes);
});

it('parent abort signal aborts drive signal', async () => {
  const view = new CarView({ car: MOCK_SINGLE_CAR, emitter: null });
  const controller = new CarController(view, engineService, garageService);

  const parentController = new AbortController();
  const drivePromise = controller.drive(parentController.signal);

  parentController.abort();

  await expect(drivePromise).rejects.toBeDefined();
});

it('startEngine sets drive metrics to view', async () => {
  const view = new CarView({ car: MOCK_SINGLE_CAR, emitter: null });
  const controller = new CarController(view, engineService, garageService);

  const setMetricsSpy = vi.spyOn(view, 'setDriveMetrics');
  await controller.startEngine(view.getAbortSignal());

  expect(setMetricsSpy).toBeCalled();
});

it('stop aborts active drive AbortController', async () => {
  const view = new CarView({ car: MOCK_SINGLE_CAR, emitter: null });
  const controller = new CarController(view, engineService, garageService);

  await controller.drive(view.getAbortSignal());

  const toggleSpy = vi.spyOn(engineService, 'toggle');
  toggleSpy.mockResolvedValue(MOCK_STOPPED_ENGINE_METRICS);

  await controller.stop();

  expect(toggleSpy).toBeCalledWith(MOCK_SINGLE_CAR.id, 'stopped', expect.any(AbortSignal));
});

it('delete passes abort signal when drive is active', async () => {
  const view = new CarView({ car: MOCK_SINGLE_CAR, emitter: null });
  const controller = new CarController(view, engineService, garageService);

  await controller.drive(view.getAbortSignal());

  const deleteSpy = vi.spyOn(garageService, 'delete');
  await controller.delete();

  expect(deleteSpy).toBeCalled();
});

it('update passes abort signal when drive is active', async () => {
  const view = new CarView({ car: MOCK_SINGLE_CAR, emitter: null });
  const controller = new CarController(view, engineService, garageService);

  await controller.drive(view.getAbortSignal());

  const updateSpy = vi.spyOn(garageService, 'update');
  await controller.update({ color: 'red', name: 'test' });

  expect(updateSpy).toBeCalled();
});
