import './styles/style.css';
import { winnersPage } from './pages/winners-page/winners';

const root = document.querySelector('#app');
if (!root) throw new Error('Root element not found');

root.append(winnersPage);
