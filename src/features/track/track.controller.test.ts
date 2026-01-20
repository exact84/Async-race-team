/* eslint-disable @typescript-eslint/dot-notation */
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

it('initialize calls garageService.getAll()', async () => {
  const controller = new TrackController(
    new TrackView(),
    engineService,
    garageService,
    winnersService
  );

  const getAllSpy = vi.spyOn(garageService, 'getAll');

  await controller.initialize();

  expect(getAllSpy).toBeCalled();
});

it('startRace calls engineService and winnersService appropriately', async () => {
  const controller = new TrackController(
    new TrackView(),
    engineService,
    garageService,
    winnersService
  );

  await controller.initialize();

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

  await controller.initialize();

  const carController = controller['carControllers'][0];
  const startEngineSpy = vi.spyOn(carController, 'startEngine');
  const startAnimationSpy = vi.spyOn(carController, 'startAnimation');

  await controller['startAllEngines'](new AbortController().signal);

  expect(startEngineSpy).toBeCalled();
  expect(startAnimationSpy).toBeCalled();
});
