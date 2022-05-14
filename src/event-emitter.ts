export type Listener<Event> = (event: Event) => void;
export type Listeners<Events extends { [key: string]: unknown }> = {
  [K in keyof Events]: Listener<Events[K]>[];
};
export type Unsubscribe = () => void;

export default class EventEmitter<Events extends { [key: string]: unknown }> {
  _listeners: Listeners<Events> = {} as Listeners<Events>;

  /**
   * Simple implementation of event emitter compatible for browser
   * @example
   * ```js
   * // Define events as a map of {<type>: <event-data>, ...}
   * type Events = {
   *   update: { payload: string },
   *   // ...
   * }
   *
   * const emitter = new EventEmitter<Events>()
   *
   * const listener = () => {
   *   // ...
   * }
   *
   * emitter.on('update', listener)
   * emitter.off('update', listener)
   * emitter.emit('update', { payload: 'data' })
   * ```
   */
  constructor() {
    this.emit = this.emit.bind(this);
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
  }

  /**
   * Register a listener
   * @example
   * ```js
   * const listener = () => ...
   * .on('update', listener)
   * ```
   */
  on<Type extends keyof Events>(type: Type, listener: Listener<Events[Type]>): Unsubscribe {
    if (!type) throw new Error('Cannot call <EventEmitter>.on(...) without a type');
    if (!listener) throw new Error('Cannot call <EventEmitter>.on(...) without a listener');
    if (!this._listeners[type]) this._listeners[type] = [];
    this._listeners[type].push(listener);
    return () => {
      this.off(type, listener);
    };
  }

  /**
   * Unregister listener
   * @example
   * ```js
   * const listener = () => ...
   * .off('update', listener)
   * ```
   */
  off<Type extends keyof Events>(type: Type, listener: Listener<Events[Type]>): this {
    if (!type) throw new Error('Cannot call <EventEmitter>.off without a type');
    if (!listener) throw new Error('Cannot call <EventEmitter>.off without a listener');
    if (!this._listeners[type]) return this;
    const listeners = this._listeners[type].filter((fn: Listener<Events[Type]>) => fn !== listener);
    if (listeners.length > 0) {
      this._listeners[type] = listeners;
    } else {
      delete this._listeners[type];
    }
    return this;
  }

  /**
   * Emit event
   * @example
   * ```js
   * .emit('update', { payload: 'data' })
   * ```
   */
  emit<Type extends keyof Events>(type: Type, event: Events[Type]): this {
    if (!type) throw new Error('Cannot call <EventEmitter>.emit without a type');
    if (!this._listeners[type]) return this;
    this._listeners[type].forEach((listener: Listener<Events[Type]>) => listener(event));
    return this;
  }
}
