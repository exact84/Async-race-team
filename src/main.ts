import 'modern-normalize/modern-normalize.css';

import { App } from './app/app';
import './styles/styles.css';
import { Pagination } from './components/pagination/pagination';

const app = new App();

app.initialize();

let page = 1;
const totalPages = 10;

const p = new Pagination({
  onPageChange(nextPage): void {
    page = nextPage;
    p.setState({ page, totalPages });
    console.warn(page);
  },
});

p.setState({ page, totalPages });
document.body.prepend(p);
