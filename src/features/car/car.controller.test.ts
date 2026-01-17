import { MOCK_SINGLE_CAR, MOCK_STOPPED_ENGINE_METRICS } from '../../../__mocks__/data';
import { serviceProvider } from '../../services/service-provider';
import { CarController } from './car.controller';
import { CarView } from './car.view';

const engineService = serviceProvider.engineService();
const garageService = serviceProvider.garageService();

afterEach(() => {
  vi.restoreAllMocks();
});

it('delete should call garageService.delete', async () => {
  const controller = new CarController(new CarView(MOCK_SINGLE_CAR), engineService, garageService);
  const spy = vi.spyOn(garageService, 'delete');

  await controller.delete();

  expect(spy).toBeCalled();
});

it('startEngine should call engineService.toggle and view.drive', async () => {
  const view = new CarView(MOCK_SINGLE_CAR);
  const controller = new CarController(view, engineService, garageService);

  const toggleSpy = vi.spyOn(engineService, 'toggle');
  const driveSpy = vi.spyOn(view, 'drive');

  await controller.startEngine(view.getAbortSignal());

  expect(toggleSpy).toBeCalledWith(MOCK_SINGLE_CAR.id, 'started', expect.any(AbortSignal));
  expect(driveSpy).toBeCalled();
});

it('drive should call startEngine and engineService.drive', async () => {
  const view = new CarView(MOCK_SINGLE_CAR);
  const controller = new CarController(view, engineService, garageService);

  const driveSpy = vi.spyOn(engineService, 'drive');

  await controller.drive(view.getAbortSignal());

  expect(driveSpy).toBeCalledWith(MOCK_SINGLE_CAR.id, expect.any(AbortSignal));
});

it('stop should call engineService.toggle with', async () => {
  const view = new CarView(MOCK_SINGLE_CAR);
  const controller = new CarController(view, engineService, garageService);

  const toggleSpy = vi.spyOn(engineService, 'toggle');
  toggleSpy.mockResolvedValue(MOCK_STOPPED_ENGINE_METRICS);

  await controller.stop();

  expect(toggleSpy).toBeCalled();
});

it('update should call garageService.update', async () => {
  const view = new CarView(MOCK_SINGLE_CAR);
  const controller = new CarController(view, engineService, garageService);

  const updateSpy = vi.spyOn(garageService, 'update');

  await controller.update({ color: 'blue', name: 'new' });

  expect(updateSpy).toBeCalled();
});
