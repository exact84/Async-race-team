import { fireEvent, screen } from '@testing-library/dom';

import { render } from '../../../__mocks__/test-utilities';
import { Table } from './table';

function renderTable(properties: Partial<Table['props']>): Table {
  return render(() =>
    new Table({
      fallbackMessage: properties.fallbackMessage,
      headers: properties.headers ?? [],
      onSort: properties.onSort,
      records: properties.records ?? [],
      stickyHeader: properties.stickyHeader,
      testid: 'winners-table',
    }).render()
  ) as Table;
}

describe('Table component', () => {
  it('renders fallback message when no records', () => {
    renderTable({ fallbackMessage: 'No data', headers: [], records: [] });
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders headers and records', () => {
    renderTable({
      headers: [{ key: 'name', sortable: true }],
      records: [
        { cells: [{ kind: 'text', value: 'Id' }] },
        { cells: [{ kind: 'text', value: 'Color' }] },
      ],
    });

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Id')).toBeInTheDocument();
    expect(screen.getByText('Color')).toBeInTheDocument();
  });
});

describe('Table sorting', () => {
  it('calls onSort when sortable header clicked', () => {
    const onSort = vi.fn();
    renderTable({
      headers: [{ key: 'score', sortable: true }],
      onSort,
      records: [{ cells: [{ kind: 'text', value: '42' }] }],
    });

    const header = screen.getByText('Score');
    fireEvent.click(header);
    expect(onSort).toHaveBeenCalledWith('score');
  });

  it('does not call onSort for non-sortable header', () => {
    const onSort = vi.fn();
    renderTable({
      headers: [{ key: 'wins', sortable: false }],
      onSort,
      records: [{ cells: [{ kind: 'text', value: '1' }] }],
    });

    const header = screen.getByText('Wins');
    fireEvent.click(header);
    expect(onSort).not.toHaveBeenCalled();
  });

  it('renders ↓ when header.sorted is ASC', () => {
    renderTable({
      headers: [{ key: 'wins', sortable: true, sorted: 'ASC' }],
      records: [{ cells: [{ kind: 'text', value: '42' }] }],
    });

    expect(screen.getByText(/↑/)).toBeInTheDocument();
  });
  it('renders ↓ when header.sorted is DESC', () => {
    renderTable({
      headers: [{ key: 'score', sortable: true, sorted: 'DESC' }],
      records: [{ cells: [{ kind: 'text', value: '42' }] }],
    });
    expect(screen.getByText(/↓/)).toBeInTheDocument();
  });
});

describe('Table stickyHeader', () => {
  it('adds sticky class to thead when stickyHeader is true', () => {
    renderTable({
      headers: [{ key: 'name', sortable: false }],
      records: [{ cells: [{ kind: 'text', value: 'Alexey' }] }],
      stickyHeader: true,
    });
    const theadElement = document.querySelector('thead');
    if (theadElement) expect(theadElement.className).toContain('sticky');
  });
});
