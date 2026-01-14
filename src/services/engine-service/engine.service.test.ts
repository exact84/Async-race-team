import {
  MOCK_STARTED_ENGINE_METRICS,
  MOCK_STOPPED_ENGINE_METRICS,
  MOCK_SUCCESS_DRIVE_RESULT,
} from '../../../__mocks__/data';
import { serviceProvider } from '../service-provider';

const engineService = serviceProvider.engineService();

const succesRandomValue = 0.1;
const failRandomValue = 0.9;

describe(engineService.toggle.name, () => {
  it('returns engine metrics with velocity when started', async () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(succesRandomValue);

    const response = await engineService.toggle(0, 'started');

    expect(response).toEqual(MOCK_STARTED_ENGINE_METRICS);

    randomSpy.mockRestore();
  });

  it('returns engine metrics with 0 velocity when stopped', async () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(succesRandomValue);

    await engineService.toggle(0, 'started');

    const response = await engineService.toggle(0, 'stopped');

    expect(response).toEqual(MOCK_STOPPED_ENGINE_METRICS);

    randomSpy.mockRestore();
  });

  it('throws error if car not found', async () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(failRandomValue);

    const id = 555;

    await expect(engineService.toggle(id, 'started')).rejects.toThrow();

    randomSpy.mockRestore();
  });
});

describe(engineService.drive.name, () => {
  it('returns success drive object', async () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(succesRandomValue);

    const response = await engineService.drive(0);

    expect(response).toEqual(MOCK_SUCCESS_DRIVE_RESULT);

    randomSpy.mockRestore();
  });

  it('throws error if car not found', async () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(failRandomValue);

    const id = 555;

    await expect(engineService.drive(id)).rejects.toThrow();

    randomSpy.mockRestore();
  });
});
