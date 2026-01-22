import { expect, it, vi } from 'vitest';

import { Emitter } from './emitter';

interface TestEvents {
  count: string;
  empty: never;
  message: string;
}

const emitter: Emitter<TestEvents> = new Emitter<TestEvents>();

afterEach(() => {
  emitter.clear();
});

it('should call subscribed handler with payload', () => {
  const handler = vi.fn();
  emitter.on('message', handler);

  emitter.emit('message', 'hello');

  expect(handler).toHaveBeenCalledTimes(1);
  expect(handler).toHaveBeenCalledWith('hello');
});

it('should handle events with never payload', () => {
  const handler = vi.fn();
  emitter.on('empty', handler);

  emitter.emit('empty');

  expect(handler).toHaveBeenCalledTimes(1);
  expect(handler).toHaveBeenCalledWith();
});

it('should unsubscribe correctly', () => {
  const handler = vi.fn();
  const unsubscribe = emitter.on('count', handler);

  emitter.emit('count', '42');
  unsubscribe();
  emitter.emit('count', '100');

  expect(handler).toHaveBeenCalledTimes(1);
  expect(handler).toHaveBeenCalledWith('42');
});

it('should clear specific event', () => {
  const handlerMessage = vi.fn();
  const handlerCount = vi.fn();
  emitter.on('message', handlerMessage);
  emitter.on('count', handlerCount);

  emitter.clear('message');

  emitter.emit('message', 'hello');
  emitter.emit('count', '10');

  expect(handlerMessage).not.toHaveBeenCalled();
  expect(handlerCount).toHaveBeenCalledWith('10');
});

it('should clear all events', () => {
  const handler1 = vi.fn();
  const handler2 = vi.fn();
  emitter.on('message', handler1);
  emitter.on('count', handler2);

  emitter.clear();

  emitter.emit('message', 'hello');
  emitter.emit('count', '10');

  expect(handler1).not.toHaveBeenCalled();
  expect(handler2).not.toHaveBeenCalled();
});
