import { div } from '@ripetchor/dom';

import styles from './car-image.module.css';

export interface CarImageProperties {
  color: string;
  size?: CarImageSize;
}

type CarImageSize = 'lg' | 'md' | 'sm';

const SIZE_MAP: Record<CarImageSize, string> = { lg: styles.lg, md: styles.md, sm: styles.sm };

// TODO: Remove Component and defineElement fn ========================================================================================
type UpdateFunction<S> = (state: S) => Partial<S>;

abstract class Component<P extends object = object, S extends object = object> extends HTMLElement {
  protected readonly props: P;

  protected state: S;

  private pending = false;

  private updateFunctions: UpdateFunction<S>[] = [];

  public constructor(properties?: P) {
    super();

    this.props = Object.freeze(Object.assign({}, properties));
    this.state = Object.assign({}) as S;
  }

  public abstract render(): HTMLElement;

  protected connectedCallback(): void {
    this.replaceChildren(this.render());
  }

  protected setState(nextState: ((previous: S) => Partial<S>) | Partial<S>): void {
    const updateFunction =
      typeof nextState === 'function'
        ? nextState
        : (previous: S): S => ({ ...previous, ...nextState });

    this.updateFunctions.push(updateFunction);

    if (!this.pending) {
      this.pending = true;

      queueMicrotask(() => {
        this.flush();
      });
    }
  }

  private flush(): void {
    const nextState = Object.assign({}, this.state);

    for (const updateFunction of this.updateFunctions) {
      Object.assign(nextState, updateFunction(nextState));
    }

    this.state = nextState;

    this.updateFunctions.length = 0;

    this.pending = false;

    this.replaceChildren(this.render());
  }
}

export class CarImage extends Component<CarImageProperties> {
  private readonly carIcon = div({ className: styles.icon });

  public constructor(properties: CarImageProperties) {
    super(properties);

    this.classList.add(styles.container);

    this.setSize(SIZE_MAP[properties.size ?? 'sm']);
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

function defineElement(name: string, ctor: CustomElementConstructor): void {
  customElements.define(`app-${name}`, ctor);
}

defineElement('car-image', CarImage);
