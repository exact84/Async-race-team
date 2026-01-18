import 'modern-normalize/modern-normalize.css';
import { button } from '@ripetchor/dom';

import { App } from './app/app';
import { TrackController } from './features/track/track.controller';
import { TrackView } from './features/track/track.view';
import './styles/styles.css';
import { serviceProvider } from './services/service-provider';

const app = new App();

app.initialize();

const garageServie = serviceProvider.garageService();
const engineService = serviceProvider.engineService();
const winnersService = serviceProvider.winnersService();

const trackController = new TrackController(
  new TrackView(),
  engineService,
  garageServie,
  winnersService
);

const stopRaceButton = button(
  {
    click: () => {
      trackController.stopRace().catch(console.warn);
    },
  },
  'Stop race'
);

const startRaceButton = button(
  {
    click: () => {
      trackController.startRace().catch(console.warn);
    },
  },
  'Start race'
);

document.body.append(trackController.getView(), startRaceButton, stopRaceButton);
