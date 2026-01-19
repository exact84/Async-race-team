import 'modern-normalize/modern-normalize.css';

import { App } from './app/app';
import './styles/styles.css';
import { TrackControls } from './components/track-controls/track-controls';

const app = new App();

app.initialize();

const controls = new TrackControls();

document.body.append(controls);
