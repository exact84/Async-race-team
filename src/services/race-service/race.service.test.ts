import {
  MOCK_CARS_ARRAY,
  MOCK_SINGLE_CAR,
  MOCK_STOPPED_ENGINE_METRICS,
} from '../../../__mocks__/data';
import { serviceProvider } from '../service-provider';

const raceService = serviceProvider.raceService();
const engineService = serviceProvider.engineService();

const succesRandomValue = 0.1;
const failRandomValue = 0.9;

afterEach(() => {
  vi.restoreAllMocks();
});

describe(raceService.startRace.name, () => {
  it('calls race start, end and winner callbacks on successful race', async () => {
    const signal = new AbortController().signal;

    vi.spyOn(Math, 'random').mockReturnValue(succesRandomValue);

    const raceStartMock = vi.fn();
    const raceEndedMock = vi.fn();
    const carCrashMock = vi.fn();
    const winnerMock = vi.fn();

    await raceService.startRace({
      onCarCrash: carCrashMock,
      onRaceEnded: raceEndedMock,
      onRaceStart: raceStartMock,
      onWinner: winnerMock,
      signal,
    });

    expect(raceStartMock).toBeCalled();
    expect(raceEndedMock).toBeCalled();
    expect(carCrashMock).not.toBeCalled();
    expect(winnerMock).toBeCalled();
  });
});

describe(raceService.stopRace.name, () => {
  it('stops all engines when stopRace is called', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(failRandomValue);

    const stopEngineSpy = vi
      .spyOn(engineService, 'toggle')
      .mockResolvedValue(MOCK_STOPPED_ENGINE_METRICS);

    await raceService.stopRace();

    expect(stopEngineSpy).toBeCalledTimes(MOCK_CARS_ARRAY.length);
  });
});

describe(raceService.startCarSingle.name, () => {
  it('calls onFinish when drive succeeds', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(succesRandomValue);

    const signal = new AbortController().signal;

    const carFinishMock = vi.fn();
    const carCrashMock = vi.fn();

    await raceService.startCarSingle(MOCK_SINGLE_CAR, {
      onCrash: carCrashMock,
      onFinish: carFinishMock,
      signal,
    });

    expect(carFinishMock).toBeCalled();
    expect(carCrashMock).not.toBeCalled();
  });

  it('calls onCrash when drive rejects', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(failRandomValue);

    const signal = new AbortController().signal;

    const carFinishMock = vi.fn();
    const carCrashMock = vi.fn();

    await raceService.startCarSingle(MOCK_SINGLE_CAR, {
      onCrash: carCrashMock,
      onFinish: carFinishMock,
      signal,
    });

    expect(carFinishMock).not.toBeCalled();
    expect(carCrashMock).toBeCalled();
  });
});
