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

const trackController = new TrackController(new TrackView(), engineService, garageServie);

document.body.append(trackController.getView());
