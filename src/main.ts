import 'modern-normalize/modern-normalize.css';

import './styles/styles.css';
import { App } from './app/app';
import { CarController } from './features/car/car.controller';
import { CarView } from './features/car/car.view';
import { serviceProvider } from './services/service-provider';

const app = new App();

app.initialize();

const garageService = serviceProvider.garageService();
const engineService = serviceProvider.engineService();

const cars = await garageService.getAll();

for (const car of cars) {
  const carView = new CarView(car);

  const carPresenter = new CarController(carView, engineService, garageService);

  document.body.append(carPresenter.getView());
}
