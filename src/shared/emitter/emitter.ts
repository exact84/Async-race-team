type EventHandler<T> = (...payload: T[]) => void;

export class Emitter<EventsMap extends object> {
  private readonly listeners: Partial<{ [K in keyof EventsMap]: Set<EventHandler<EventsMap[K]>> }> =
    {};

  public clear<Key extends keyof EventsMap>(event?: Key): void {
    if (event) {
      Reflect.deleteProperty(this.listeners, event);
    } else {
      for (const key in this.listeners) {
        Reflect.deleteProperty(this.listeners, key);
      }
    }
  }

  public emit<Key extends keyof EventsMap>(
    event: Key,
    ...payload: EventsMap[Key] extends never ? [] : [EventsMap[Key]]
  ): void {
    const set = this.listeners[event];

    if (!set) {
      return;
    }

    for (const handler of set) {
      handler(...payload);
    }
  }

  public on<Key extends keyof EventsMap>(
    event: Key,
    handler: EventHandler<EventsMap[Key]>
  ): VoidFunction {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set();
    }

    this.listeners[event].add(handler);

    return () => {
      const set = this.listeners[event];

      if (!set) {
        return;
      }

      set.delete(handler);

      if (set.size === 0) {
        Reflect.deleteProperty(this.listeners, event);
      }
    };
  }
}
