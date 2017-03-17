import isFunction from 'lodash/isFunction';

let mixinCounter = 0;

const interpolateWithMixins = (strings, ...values) => {
  const mixinsFunctions = {};

  const raw = strings.reduce(
    (rule, part, i) => {
      let value = values[i] === undefined ? '' : values[i];

      if (isFunction(value)) {
        const name = `${value.displayName || value.name || `${++mixinCounter}`}`;

        let placeholder = `_MIXIN_${name}`;

        mixinsFunctions[placeholder] = value;

        value = placeholder;
      }

      return rule + part + value;
    },
    ''
  );

  return { raw, mixinsFunctions };
};

export default interpolateWithMixins;
