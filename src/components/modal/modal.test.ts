import { div } from '@ripetchor/dom';
import { getByTestId } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { Modal } from './modal';

it('displays passed title', () => {
  const modal = new Modal({ title: 'Foo' });

  modal.open(() => div(null));

  const heading = getByTestId(modal.getContainer(), 'modal-heading');

  expect(heading).toHaveTextContent('Foo');
});

it('renders correct children', () => {
  const modal = new Modal({ title: 'Foo' });

  modal.open(() => div({ 'data-testid': 'foo' }));

  const children = getByTestId(modal.getContainer(), 'foo');

  expect(modal.getContainer()).toContain(children);
});

it('calls onClose callback', () => {
  const onCloseMock = vi.fn();

  const modal = new Modal({ onClose: onCloseMock, title: 'Foo' });

  modal.open(() => div(null));

  modal.close();

  expect(onCloseMock).toBeCalledTimes(1);
});

it('should be closed via Escape press', async () => {
  const user = userEvent.setup();

  const modal = new Modal({ title: 'Foo' });

  modal.open(() => div(null));

  await user.keyboard('{Escape}');

  expect(document.body).not.toContain(modal.getContainer());
});

it('should be closed via close button', async () => {
  const user = userEvent.setup();

  const modal = new Modal({ title: 'Foo' });

  modal.open(() => div(null));

  const buttonClose = getByTestId(modal.getContainer(), 'button-modal-close');

  await user.click(buttonClose);

  expect(document.body).not.toContain(modal.getContainer());
});
