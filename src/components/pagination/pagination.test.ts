import { getByTestId, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { render } from '../../../__mocks__/test-utilities';
import { Pagination } from './pagination';

it('should render to DOM', () => {
  const component = render(() => new Pagination({ onPageChange: vi.fn() }));
  expect(component).toBeInTheDocument();
});

it('should return an AbortSignal from getAbortSignal', () => {
  const component = render(() => new Pagination({ onPageChange: vi.fn() }));
  const signal = component.getAbortSignal();

  expect(signal).toBeInstanceOf(AbortSignal);
});

it('should display correct pages info in render', async () => {
  const component = render(() => new Pagination({ onPageChange: vi.fn() }));

  await waitFor(() => {
    component.setState({ page: 2, totalPages: 10 });
  });

  const info = getByTestId(component, 'info');

  expect(info.textContent).toBe('2 / 10');
});

it('should call onPageChange with next page when next button is clicked', async () => {
  const onPageChange = vi.fn();
  const component = render(() => new Pagination({ onPageChange }));

  component.setState({ page: 2, totalPages: 5 });

  const buttonNext = getByTestId(component, 'button-next');

  await userEvent.click(buttonNext);

  expect(onPageChange).toHaveBeenCalledOnce();
});

it('should call onPageChange with previous page when previous button is clicked', async () => {
  const onPageChange = vi.fn();
  const component = render(() => new Pagination({ onPageChange }));

  component.setState({ page: 3, totalPages: 5 });

  const buttonPrevious = getByTestId(component, 'button-previous');

  await userEvent.click(buttonPrevious);

  expect(onPageChange).toHaveBeenCalledOnce();
});

it('should disable previous button on first page', async () => {
  const component = render(() => new Pagination({ onPageChange: vi.fn() }));

  await waitFor(() => {
    component.setState({ page: 1, totalPages: 5 });
  });

  const buttonPrevious = getByTestId(component, 'button-previous');
  const buttonNext = getByTestId(component, 'button-next');

  expect(buttonPrevious).toBeDisabled();
  expect(buttonNext).not.toBeDisabled();
});

it('should disable next button on last page', async () => {
  const component = render(() => new Pagination({ onPageChange: vi.fn() }));

  await waitFor(() => {
    component.setState({ page: 5, totalPages: 5 });
  });

  const buttonPrevious = getByTestId(component, 'button-previous');
  const buttonNext = getByTestId(component, 'button-next');

  expect(buttonNext).toBeDisabled();
  expect(buttonPrevious).not.toBeDisabled();
});
