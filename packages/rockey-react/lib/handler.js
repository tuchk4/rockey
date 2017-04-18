import { when } from 'rockey';

export const ROCKEY_MIXIN_HANDLER_KEY = '__ROCKEY_MIXIN_HANDLER_KEY__';

let counters = {};

const handler = (event, condition) => {
  if (!counters[event]) {
    counters[event] = 0;
  }

  return (...args) => {
    const rockeyWhenFunction = when(`${event}${++counters[event]}`, () => true)(
      ...args
    );

    let eventArguments = null;
    const mixin = () => {
      return eventArguments ? rockeyWhenFunction(...eventArguments) : null;
    };

    mixin[ROCKEY_MIXIN_HANDLER_KEY] = true;

    mixin.clear = () => {
      eventArguments = null;
    };

    mixin.assign = (...args) => {
      if (condition(...args)) {
        eventArguments = args;
        return true;
      } else {
        eventArguments = null;
        return false;
      }
    };

    mixin.event = event;

    return mixin;
  };
};

export default handler;
