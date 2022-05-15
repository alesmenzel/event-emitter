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

  it('removes all listeners of the same type', () => {
    type TestEvents = {
      event1: { payload1: string };
      event2: { payload2: string };
      event3: { payload3: string };
    };

    const emitter = new EventEmitter<TestEvents>();
    const listener1 = jest.fn();
    const listener2 = jest.fn();
    const listener3 = jest.fn();
    const listener4 = jest.fn();
    const listener5 = jest.fn();
    emitter.on('event1', listener1);
    emitter.on('event1', listener2);
    emitter.on('event2', listener3);
    emitter.on('event3', listener4);
    emitter.on('event3', listener5);
    emitter.emit('event1', { payload1: 'something1' });
    emitter.emit('event2', { payload2: 'something2' });
    emitter.emit('event3', { payload3: 'something3' });
    emitter.off('event1');
    emitter.emit('event1', { payload1: 'something1-2' });
    emitter.emit('event2', { payload2: 'something2-2' });
    emitter.emit('event3', { payload3: 'something3-2' });
    expect(listener1).toBeCalledTimes(1);
    expect(listener2).toBeCalledTimes(1);
    expect(listener3).toBeCalledTimes(2);
    expect(listener4).toBeCalledTimes(2);
    expect(listener5).toBeCalledTimes(2);
    expect(listener1).nthCalledWith(1, { payload1: 'something1' });
    expect(listener2).nthCalledWith(1, { payload1: 'something1' });
    expect(listener3).nthCalledWith(1, { payload2: 'something2' });
    expect(listener3).nthCalledWith(2, { payload2: 'something2-2' });
    expect(listener4).nthCalledWith(1, { payload3: 'something3' });
    expect(listener4).nthCalledWith(2, { payload3: 'something3-2' });
    expect(listener5).nthCalledWith(1, { payload3: 'something3' });
    expect(listener5).nthCalledWith(2, { payload3: 'something3-2' });
  });
});
