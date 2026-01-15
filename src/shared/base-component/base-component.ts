type UpdateFunction<S> = (state: S) => Partial<S>;

export abstract class Component<
  P extends object = object,
  S extends object = object,
> extends HTMLElement {
  protected _props: P;

  protected state: S;

  protected get props(): P {
    return this._props;
  }

  private pending = false;

  private updates: UpdateFunction<S>[] = [];

  public constructor(properties?: P) {
    super();

    this._props = Object.freeze(Object.assign({}, properties));
    this.state = Object.assign({}) as S;
  }

  public abstract render(): HTMLElement;

  public setProps(properties: P): void {
    this._props = Object.freeze({ ...properties });
    this.connectedCallback();
  }

  protected connectedCallback(): void {
    this.replaceChildren(this.render());
  }

  protected setState(nextState: ((previous: S) => Partial<S>) | Partial<S>): void {
    const updateFunction =
      typeof nextState === 'function'
        ? nextState
        : (previous: S): Partial<S> => {
            return { ...previous, ...nextState };
          };

    this.updates.push(updateFunction);

    if (!this.pending) {
      this.pending = true;

      queueMicrotask(() => {
        this.flush();
      });
    }
  }

  private flush(): void {
    const nextState = Object.assign({}, this.state);

    for (const update of this.updates) {
      const updateFunction = update;
      Object.assign(nextState, updateFunction(nextState));
    }

    this.state = nextState;
    this.updates.length = 0;
    this.replaceChildren(this.render());
    this.pending = false;
  }
}

export function defineElement(name: string, ctor: CustomElementConstructor): string {
  const tag = `app-${name}`;

  const existing = customElements.get(tag);
  if (!existing) {
    customElements.define(tag, ctor);
  } else if (existing !== ctor) {
    throw new Error(`${tag} already defined with another class`);
  }

  return tag;
}
