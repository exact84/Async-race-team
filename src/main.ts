import 'modern-normalize/modern-normalize.css';

import './styles/styles.css';

import { button } from '@ripetchor/dom';

import { TrackController } from './features/track/track.controller';
import { TrackView } from './features/track/track.view';
import { serviceProvider } from './services/service-provider';

const engineService = serviceProvider.engineService();
const garageService = serviceProvider.garageService();
const winnersService = serviceProvider.winnersService();

const trackController = new TrackController(
  new TrackView(),
  engineService,
  garageService,
  winnersService
);

await trackController.initialize();

const startRaceButton = button(
  {
    click: () => {
      trackController.startRace().catch(console.warn);
    },
  },
  'Start race'
);

const stopRaceButton = button(
  {
    click: () => {
      trackController.stopRace().catch(console.warn);
    },
  },
  'Stop race'
);

document.body.append(startRaceButton, stopRaceButton, trackController.getView());
