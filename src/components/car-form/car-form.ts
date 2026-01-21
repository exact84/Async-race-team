import { form, input, label } from '@ripetchor/dom';

import type { Car } from '../../services/garage-service/types';

import { createRandomCar } from '../../services/garage-service/utilities';
import { Component, defineElement } from '../../shared/component/component';
import { Button } from '../button/button';
import { CarImage } from '../car-image/car-image';
import styles from './car-form.module.css';

export type CarFormProperties = CreateFormProperties | UpdateFormProperties;

interface CreateFormProperties {
  mode: 'create';
  onSubmit: FormSubmitCallback;
}

type FormSubmitCallback = (car: Car) => void;

type UpdateFormProperties = Car & { mode: 'update'; onSubmit: FormSubmitCallback };

export class CarForm extends Component<CarFormProperties> {
  private readonly abortController = new AbortController();

  private readonly buttonSubmit = new Button({
    testid: 'button-submit-car-form',
    textContent: 'Submit',
  });

  private readonly carImage = new CarImage({ color: 'white', size: 'lg' });

  private readonly inputColor = input({
    'change': (event) => {
      this.carImage.setColor(event.currentTarget.value);
    },
    'data-testid': 'input-car-color',
    'id': 'car-color',
    'signal': this.abortController.signal,
    'type': 'color',
  });

  private readonly labelColor = label(
    { className: styles.label, htmlFor: 'car-color' },
    'Color',
    this.inputColor
  );

  private readonly inputName = input({
    'autofocus': true,
    'className': styles.input,
    'data-testid': 'input-car-name',
    'id': 'car-name',
    'input': () => {
      this.updateSubmitButtonState();
    },
    'signal': this.abortController.signal,
    'type': 'text',
  });

  private readonly labelName = label(
    { className: styles.label, htmlFor: 'car-name' },
    'Name',
    this.inputName
  );

  private readonly formElement = form(
    {
      'className': styles.form,
      'data-testid': 'input-car-form',
      'signal': this.abortController.signal,
      'submit': (event) => {
        this.handleSubmit(event);
      },
    },
    this.labelName,
    this.labelColor,
    this.carImage,
    this.buttonSubmit
  );

  public constructor(properties: CarFormProperties) {
    super(properties);

    if (properties.mode === 'create') {
      const { color, name } = createRandomCar();

      this.carImage.setColor(color);
      this.inputColor.value = color;
      this.inputName.value = name;
    }

    if (properties.mode === 'update') {
      this.carImage.setColor(properties.color);
      this.inputColor.value = properties.color;
      this.inputName.value = properties.name;
    }
  }

  public render(): DocumentFragment | HTMLElement {
    return this.formElement;
  }

  protected disconnectedCallback(): void {
    this.abortController.abort();
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault();

    const id = this.props.mode === 'update' ? this.props.id : Number.NaN;

    this.props.onSubmit({ color: this.inputColor.value, id, name: this.inputName.value.trim() });
  }

  private updateSubmitButtonState(): void {
    const isDisabled = this.inputName.value.trim().length === 0;

    this.buttonSubmit.toggleDisabled(isDisabled);
  }
}

defineElement('car-form', CarForm);
