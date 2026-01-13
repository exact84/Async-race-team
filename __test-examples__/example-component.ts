interface ExampleComponentProperties {
  age: string;
  name: string;
}

export function exampleComponent(properties?: ExampleComponentProperties): HTMLElement {
  const { age = '25', name = 'Lana' } = properties ?? {};

  const component = document.createElement('div');
  component.dataset.testid = 'component';

  const nameElement = document.createElement('div');
  nameElement.textContent = name;
  nameElement.dataset.testid = 'name';

  const ageElement = document.createElement('div');
  ageElement.textContent = age;
  ageElement.dataset.testid = 'age';

  const buttonElement = document.createElement('button');
  buttonElement.dataset.testid = 'btn';

  buttonElement.addEventListener('click', () => {
    nameElement.textContent = 'Elsa';
  });

  component.append(nameElement, ageElement, buttonElement);

  return component;
}
