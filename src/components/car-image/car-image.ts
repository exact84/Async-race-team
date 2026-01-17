import { div } from '@ripetchor/dom';

import { Component, defineElement } from '../../shared/component/component';
import styles from './car-image.module.css';

export interface CarImageProperties {
  color: string;
  size?: CarImageSize;
}

type CarImageSize = 'lg' | 'md' | 'sm';

export const CAR_IMAGE_SIZE: Record<CarImageSize, string> = {
  lg: styles.lg,
  md: styles.md,
  sm: styles.sm,
};

export class CarImage extends Component<CarImageProperties> {
  private readonly carIcon = div({ 'className': styles.icon, 'data-testid': 'car-icon' });

  public constructor(properties: CarImageProperties) {
    super(properties);

    this.classList.add(styles.container);

    this.setSize(CAR_IMAGE_SIZE[properties.size ?? 'sm']);
    this.setColor(properties.color);
  }

  public render(): HTMLElement {
    return this.carIcon;
  }

  public setColor(color: string): void {
    this.carIcon.style.backgroundColor = color;
  }

  private setSize(size: string): void {
    this.carIcon.classList.remove(styles.sm, styles.md, styles.lg);
    this.carIcon.classList.add(size);
  }
}

defineElement('car-image', CarImage);
