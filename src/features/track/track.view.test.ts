import { getAllByTestId, waitFor } from '@testing-library/dom';

import { MOCK_SINGLE_CAR } from '../../../__mocks__/data';
import { render } from '../../../__mocks__/test-utilities';
import { serviceProvider } from '../../services/service-provider';
import { CarController } from '../car/car.controller';
import { CarView } from '../car/car.view';
import { TrackView } from './track.view';

const engineService = serviceProvider.engineService();
const garageService = serviceProvider.garageService();

const controller = new CarController(
  new CarView({ car: MOCK_SINGLE_CAR, emitter: null }),
  engineService,
  garageService
);

it('should be in DOM', () => {
  const view = render(() => new TrackView());

  expect(view).toBeInTheDocument();
});

it('should render track lanes with car views', async () => {
  const view = render(() => new TrackView());

  const controllers = [controller, controller, controller, controller, controller];

  await waitFor(() => {
    view.setState({ carControllers: controllers });
  });

  const trackLanes = getAllByTestId(view, 'track-lane');

  expect(trackLanes.length).toBe(controllers.length);
});
