/* eslint-disable @typescript-eslint/dot-notation */
import { MOCK_CARS_ARRAY } from '../../../__mocks__/data';
import { serviceProvider } from '../../services/service-provider';
import { TrackController } from './track.controller';
import { TrackView } from './track.view';

const engineService = serviceProvider.engineService();
const garageService = serviceProvider.garageService();
const winnersService = serviceProvider.winnersService();

afterEach(() => {
  vi.restoreAllMocks();
});

it('returns correct view', () => {
  const controller = new TrackController(
    new TrackView(),
    engineService,
    garageService,
    winnersService
  );

  expect(controller.getView()).toBeInstanceOf(TrackView);
});

it('startRace calls engineService and winnersService appropriately', async () => {
  const controller = new TrackController(
    new TrackView(),
    engineService,
    garageService,
    winnersService
  );

  controller.updateView(MOCK_CARS_ARRAY);

  const carController = controller['carControllers'][0];
  const startEngineSpy = vi.spyOn(carController, 'startEngine');
  const driveSpy = vi.spyOn(carController, 'drive');
  const winnerUpsertSpy = vi.spyOn(winnersService, 'upsert');

  await controller.startRace();

  expect(startEngineSpy).toBeCalled();
  expect(driveSpy).toBeCalled();
  expect(winnerUpsertSpy).toBeCalled();
});

it('startAllEngines starts engines and animations', async () => {
  const controller = new TrackController(
    new TrackView(),
    engineService,
    garageService,
    winnersService
  );

  controller.updateView(MOCK_CARS_ARRAY);

  const carController = controller['carControllers'][0];
  const startEngineSpy = vi.spyOn(carController, 'startEngine');
  const startAnimationSpy = vi.spyOn(carController, 'startAnimation');

  await controller['startAllEngines'](new AbortController().signal);

  expect(startEngineSpy).toBeCalled();
  expect(startAnimationSpy).toBeCalled();
});
