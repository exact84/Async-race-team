import { userEvent } from '@testing-library/user-event';

import { Button } from './button';
import styles from './button.module.css';

describe(Button.name, () => {
  it('applies base button class and size modifier class', () => {
    const button = new Button({ buttonSize: 'lg', textContent: 'Large Button' });

    document.body.append(button);

    const element = button.querySelector('button');

    expect(element).toHaveClass(styles.button);
    expect(element).toHaveClass(styles['button-lg']);
  });

  it('calls onClick handler on click', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    const button = new Button({ onClick, textContent: 'Click' });

    document.body.append(button);

    const element = button.querySelector('button');

    if (element) {
      await user.click(element);
    }

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onToggle handler on toggle event', () => {
    const onToggle = vi.fn();

    const button = new Button({ onToggle, textContent: 'Toggle' });

    document.body.append(button);

    const element = button.querySelector('button');

    if (element) {
      element.dispatchEvent(new Event('toggle'));
    }

    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});

describe('Button as Component', () => {
  it('should render in DOM with text', () => {
    const button = new Button({ textContent: 'Click me' });
    document.body.append(button);

    const buttonElement = button.querySelector('button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement?.textContent).toBe('Click me');
  });

  it('getProps should return props', () => {
    const button = new Button({ buttonSize: 'md', textContent: 'Hello' });
    expect(button.getProps()).toEqual({ buttonSize: 'md', textContent: 'Hello' });
  });

  it('click should trigger onClick', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    const button = new Button({ onClick, textContent: 'Click' });
    document.body.append(button);

    const buttonElement = button.querySelector('button');

    if (buttonElement) await user.click(buttonElement);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('removes event listeners after disconnectedCallback', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    const button = new Button({ onClick, textContent: 'Click' });

    document.body.append(button);

    const element = button.querySelector('button');

    button.disconnectedCallback();

    if (element) await user.click(element);

    expect(onClick).not.toHaveBeenCalled();
  });
});
