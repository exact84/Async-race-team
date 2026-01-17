import 'modern-normalize/modern-normalize.css';

import './styles/styles.css';
import { App } from './app/app';
import { serviceProvider } from './services/service-provider';

const app = new App();

app.initialize();

const winnersService = serviceProvider.winnersService();

const winners = await winnersService.getAll();

console.warn(winners);
