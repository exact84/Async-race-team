import 'modern-normalize/modern-normalize.css';

import { App } from './app/app';
import './styles/styles.css';
import { CarForm } from './components/car-form/car-form';

const app = new App();

app.initialize();

const carForm = new CarForm({
  mode: 'create',
  onSubmit: (data): void => {
    console.warn(data);
  },
});

document.body.prepend(carForm);
