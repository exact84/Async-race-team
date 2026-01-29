type UpdateFunction<S> = (state: S) => Partial<S>;

export abstract class Component<
  P extends object = object,
  S extends object = object,
> extends HTMLElement {
  protected readonly props: P;

  protected state: S;

  private pending = false;

  private updateFunctions: UpdateFunction<S>[] = [];

  public constructor(properties?: P) {
    super();

    this.props = Object.freeze(Object.assign({}, properties));
    this.state = Object.assign({}) as S;
  }

  public getProps(): Readonly<P> {
    return this.props;
  }

  public abstract render(): DocumentFragment | HTMLElement;

  public setState(nextState: ((previous: S) => Partial<S>) | Partial<S>): void {
    const updateFunction =
      typeof nextState === 'function'
        ? nextState
        : (previous: S): Partial<S> => ({ ...previous, ...nextState });

    this.updateFunctions.push(updateFunction);

    if (!this.pending) {
      this.pending = true;

      queueMicrotask(() => {
        this.flush();
      });
    }
  }

  protected connectedCallback(): void {
    this.update();
  }

  private flush(): void {
    const nextState = Object.assign({}, this.state);

    for (const updateFunction of this.updateFunctions) {
      Object.assign(nextState, updateFunction(nextState));
    }

    this.state = nextState;

    this.updateFunctions.length = 0;

    this.pending = false;

    this.update();
  }

  private update(): void {
    this.replaceChildren(this.render());
  }
}

export function defineElement(name: string, ctor: CustomElementConstructor): void {
  customElements.define('app-' + name, ctor);
}
