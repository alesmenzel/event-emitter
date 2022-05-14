# Event Emitter

Type-safe Event Emitter implementation that works in browsers. For server usage, stick with the nodejs [EventEmitter](https://nodejs.org/dist/latest-v16.x/docs/api/events.html#class-eventemitter).

## Why do should I use it instead of `EventTarget`?

Don't. If [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/EventTarget) meets your needs, then use it - you will save on package size and use a standard way to handle events. But if you have taken a look
at the compatibility table, you will find one alarming thing. The `EventTarget's constructor` has been supported
in the major browsers only since late 2020, so trying to run `class MyClass extends EventTarget {}` in older browser
will crash.

## Installation

```bash
npm install @alesmenzel/event-emitter
```

## Usage

```ts
type MyEvents = {
  count: (count: number) => void
  // define all your events and their data
}

const emitter = new EventEmitter<MyEvents>()

emitter.emit('count', 1)
emitter.emit('count', 2)
emitter.emit('count', 3)
```
