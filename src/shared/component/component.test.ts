import { Component } from '../../shared/component/component';
import { defineElement } from '../../shared/component/component';

describe('Base Component', () => {
  class TestComponent extends Component<object, { count: number; name: string }> {
    public constructor() {
      super();
      this.state = { count: 0, name: 'initial' };
    }

    public getCurrentState(): { count: number; name: string } {
      return this.state;
    }

    public render(): HTMLElement {
      const div = document.createElement('div');
      div.textContent = `${String(this.state.count)} - ${this.state.name}`;
      return div;
    }

    public triggerSetState(update: object): void {
      this.setState(update);
    }
  }

  defineElement('test-component', TestComponent);

  test('setState updates from initial state with both updater types', () => {
    const component = new TestComponent();

    expect(component.getCurrentState()).toEqual({ count: 0, name: 'initial' });

    component.triggerSetState({ count: 1 });
    component.triggerSetState((previous: { count: number }): { count: number } => ({
      count: previous.count + 1,
    }));
    component.triggerSetState({ name: 'updated' });

    expect(component.getCurrentState()).toEqual({ count: 0, name: 'initial' });

    queueMicrotask(() => {
      expect(component.getCurrentState()).toEqual({ count: 2, name: 'updated' });

      expect(component.textContent).toBe('2 - updated');
    });
  });
});
