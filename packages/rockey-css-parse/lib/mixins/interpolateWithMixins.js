import isFunction from 'lodash/isFunction';
import camelCase from 'lodash/camelCase';

const MIXIN_PREFIX = '|MIXIN_';
const getMixinName = mixinFunc => mixinFunc.displayName || mixinFunc.name;

const interpolateWithMixins = (strings, ...values) => {
  const mixinsFunctions = {};
  let counter = 0;

  const raw = strings.reduce((rule, part, i) => {
    let value = values[i] === undefined ? '' : values[i];
    let raw = part.trim();

    let append = value;

    if (isFunction(value)) {
      let found = false;
      let i = 0;
      for (i = raw.length - 1; i > 0; i--) {
        if (!found) {
          if (raw[i] === ':') {
            found = true;
          } else if (raw[i] !== ' ') {
            break;
          }
        }

        if (found) {
          if (raw[i] === ' ' || raw[i] === ';' || raw[i] === '{') {
            break;
          }
        }
      }

      let prop = null;
      let name = null;

      if (found) {
        const index = i ? i : 0;

        prop = raw.slice(index, -1).trim();
        raw = raw.slice(0, index);
        name = camelCase(prop);
      } else {
        name = getMixinName(value);
      }

      let placeholder = `${MIXIN_PREFIX}${name}${++counter}`;

      if (found) {
        mixinsFunctions[placeholder] = (...args) => {
          const propValue = value(...args);
          return propValue
            ? {
                [prop]: propValue,
              }
            : null;
        };

        mixinsFunctions[placeholder].prop = prop;
        mixinsFunctions[placeholder].displayName = name;
      } else {
        mixinsFunctions[placeholder] = value;
      }

      append = `${placeholder};`;
      // append = placeholder + '; ';
    }

    return rule + raw + ' ' + append;
  }, '');

  return { raw, mixinsFunctions };
};

export default interpolateWithMixins;
