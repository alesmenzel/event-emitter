import EventEmitter from './event-emitter';

describe('EventEmitter', () => {
  it('calls given listener callback', () => {
    type TestEvents = {
      event: { payload: string };
    };

    const emitter = new EventEmitter<TestEvents>();
    const listener = jest.fn();
    emitter.on('event', listener);
    emitter.emit('event', { payload: 'something' });
    expect(listener).toBeCalledTimes(1);
    expect(listener).toBeCalledWith({ payload: 'something' });
  });

  it('calls given listener callback multiple times', () => {
    type TestEvents = {
      event: { payload: string };
    };

    const emitter = new EventEmitter<TestEvents>();
    const listener = jest.fn();
    emitter.on('event', listener);
    emitter.emit('event', { payload: 'something1' });
    emitter.emit('event', { payload: 'something2' });
    emitter.emit('event', { payload: 'something3' });
    expect(listener).toBeCalledTimes(3);
    expect(listener).nthCalledWith(1, { payload: 'something1' });
    expect(listener).nthCalledWith(2, { payload: 'something2' });
    expect(listener).nthCalledWith(3, { payload: 'something3' });
  });

  it('stops listening on event after calling .off', () => {
    type TestEvents = {
      event: { payload: string };
    };

    const emitter = new EventEmitter<TestEvents>();
    const listener = jest.fn();
    emitter.on('event', listener);
    emitter.emit('event', { payload: 'something1' });
    emitter.off('event', listener);
    emitter.emit('event', { payload: 'something2' });
    emitter.emit('event', { payload: 'something3' });
    expect(listener).toBeCalledTimes(1);
    expect(listener).toBeCalledWith({ payload: 'something1' });
  });

  it('stops listening on event after calling unsubscribe', () => {
    type TestEvents = {
      event: { payload: string };
    };

    const emitter = new EventEmitter<TestEvents>();
    const listener = jest.fn();
    const unsubscribe = emitter.on('event', listener);
    emitter.emit('event', { payload: 'something1' });
    unsubscribe();
    emitter.emit('event', { payload: 'something2' });
    emitter.emit('event', { payload: 'something3' });
    expect(listener).toBeCalledTimes(1);
    expect(listener).toBeCalledWith({ payload: 'something1' });
  });

  it('listens on multiple events', () => {
    type TestEvents = {
      event1: { payload: string };
      event2: { payload: string };
    };

    const emitter = new EventEmitter<TestEvents>();
    const listener1 = jest.fn();
    const listener2 = jest.fn();
    emitter.on('event1', listener1);
    emitter.on('event2', listener2);
    emitter.emit('event1', { payload: 'something1' });
    emitter.emit('event1', { payload: 'something2' });
    emitter.emit('event2', { payload: 'something3' });
    expect(listener1).toBeCalledTimes(2);
    expect(listener1).nthCalledWith(1, { payload: 'something1' });
    expect(listener1).nthCalledWith(2, { payload: 'something2' });
    expect(listener2).toBeCalledTimes(1);
    expect(listener2).toBeCalledWith({ payload: 'something3' });
  });

  it('keeps listening on events after a listener of the same type is removed', () => {
    type TestEvents = {
      event: { payload: string };
    };

    const emitter = new EventEmitter<TestEvents>();
    const listener1 = jest.fn();
    const listener2 = jest.fn();
    const unsubscribe = emitter.on('event', listener1);
    emitter.on('event', listener2);
    emitter.emit('event', { payload: 'something1' });
    emitter.emit('event', { payload: 'something2' });
    unsubscribe();
    emitter.emit('event', { payload: 'something3' });
    expect(listener1).toBeCalledTimes(2);
    expect(listener1).nthCalledWith(1, { payload: 'something1' });
    expect(listener1).nthCalledWith(2, { payload: 'something2' });
    expect(listener2).toBeCalledTimes(3);
    expect(listener2).nthCalledWith(1, { payload: 'something1' });
    expect(listener2).nthCalledWith(2, { payload: 'something2' });
    expect(listener2).nthCalledWith(3, { payload: 'something3' });
  });
});
