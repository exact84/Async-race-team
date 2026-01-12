import { getByTestId } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { exampleComponent } from './example-component';

describe('Example Component', () => {
  it('should be in DOM', () => {
    const component = exampleComponent();

    document.body.append(component);

    expect(component).toBeInTheDocument();
  });

  it('should render with default props', () => {
    const component = exampleComponent();

    const name = getByTestId(component, 'name');
    const age = getByTestId(component, 'age');

    expect(name).toHaveTextContent('Lana');
    expect(age).toHaveTextContent('25');
  });

  it('should render with passed props', () => {
    const component = exampleComponent({ age: '30', name: 'Nicole' });

    const name = getByTestId(component, 'name');
    const age = getByTestId(component, 'age');

    expect(name).toHaveTextContent('Nicole');
    expect(age).toHaveTextContent('30');
  });

  it('should change name after click', async () => {
    const user = userEvent.setup();

    const component = exampleComponent({ age: '30', name: 'Nicole' });

    const name = getByTestId(component, 'name');

    expect(name).toHaveTextContent('Nicole');

    const button = getByTestId(component, 'btn');

    await user.click(button);

    expect(name).toHaveTextContent('Elsa');
  });
});
