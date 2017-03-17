import interpolateString from './utils/interpolateString';

let counter = 0;

const when = (...args) => {
  let displayName = null;
  let mixinFunc = null;

  if (args.length == 1) {
    mixinFunc = args[0];
  } else {
    displayName = args[0];
    mixinFunc = args[1];
  }

  return (strings, ...values) => {
    const inline = interpolateString(strings, ...values);

    const anonWhen = (props = {}) => {
      if (mixinFunc(props)) {
        return inline;
      }

      return null;
    };

    if (displayName) {
      anonWhen.displayName = displayName;
    } else {
      // anonWhen.displayName = `anonWhen${++counter}`;
      anonWhen.displayName = `anonWhen`;
    }

    return anonWhen;
  };
};

export default when;
