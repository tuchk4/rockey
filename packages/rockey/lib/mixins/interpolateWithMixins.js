import isFunction from 'lodash/isFunction';
import camelCase from 'lodash/camelCase';

const MIXIN_PREFIX = '_MIXIN_';

const getMixinName = mixin => `${mixin.displayName || mixin.name}`;

const interpolateWithMixins = (strings, ...values) => {
  const mixinsFunctions = {};
  let counter = 0;

  const raw = strings.reduce((rule, part, i) => {
    let value = values[i] === undefined ? '' : values[i];
    let raw = part; //.trim();

    let append = value;

    if (isFunction(value)) {
      let i = raw.length;
      let found = false;

      while (true) {
        i--;

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

      let rule = null;

      if (i) {
        rule = raw.slice(i);
        raw = raw.slice(0, i);
      }

      let name = null;
      if (rule) {
        name = camelCase(rule);
      } else {
        name = getMixinName(value);
      }

      let placeholder = `${MIXIN_PREFIX}${name}${++counter}`;

      if (rule) {
        mixinsFunctions[placeholder] = (...args) => {
          return `${rule} ${value(...args)}`;
        };

        mixinsFunctions[placeholder].displayName = name;
      } else {
        mixinsFunctions[placeholder] = value;
      }

      // append = `${placeholder};`;
      append = placeholder;
    }

    return rule + raw + append;
  }, '');

  return { raw, mixinsFunctions };
};

export default interpolateWithMixins;

export const addMixins = (raw, mixinsFunctions, mixins) => {
  mixins.forEach(mixin => {
    const name = `${MIXIN_PREFIX}_ADDED_${getMixinName(mixin)}`;
    raw = raw + ' ' + name;
    mixinsFunctions[name] = mixin;
  });

  return raw;
};
