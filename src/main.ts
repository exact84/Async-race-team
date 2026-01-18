import 'modern-normalize/modern-normalize.css';

import { App } from './app/app';
import { TrackController } from './features/track/track.controller';
import { TrackView } from './features/track/track.view';
import { serviceProvider } from './services/service-provider';
import './styles/styles.css';

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

const TIMEOUT = 2000;

document.body.append(trackController.getView());

setTimeout(() => {
  trackController
    .startRace()
    .then(() => winnersService.getAll())
    .then(console.warn, console.warn);
}, TIMEOUT);
