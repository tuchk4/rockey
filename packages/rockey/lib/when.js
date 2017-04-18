import isFunction from 'lodash/isFunction';
import interpolateString from './utils/interpolateString';

const when = (...args) => {
  let displayName = null;
  let mixinFunc = null;

  if (args.length === 1) {
    mixinFunc = args[0];
  } else {
    displayName = args[0];
    mixinFunc = args[1];
  }

  return (strings, ...values) => {
    let inline = null;
    let inlineAsFunction = null;

    if (isFunction(strings)) {
      inlineAsFunction = strings;
    } else {
      inline = interpolateString(strings, ...values);
    }

    const anonWhen = (...props) => {
      if (mixinFunc(...props)) {
        return inlineAsFunction ? inlineAsFunction(...props) : inline;
      }

      return null;
    };

    if (displayName) {
      anonWhen.displayName = displayName;
    } else {
      anonWhen.displayName = `anonWhen`;
    }

    return anonWhen;
  };
};

export default when;
