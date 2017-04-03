import isFunction from 'lodash/isFunction';

let mixinCounter = 0;

const MIXIN_PREFIX = '_MIXIN_';

const getMixinName = mixin =>
  `${mixin.displayName || mixin.name || `${++mixinCounter}`}`;

const interpolateWithMixins = (strings, ...values) => {
  const mixinsFunctions = {};
  let counter = 0;

  const raw = strings.reduce(
    (rule, part, i) => {
      let value = values[i] === undefined ? '' : values[i];

      if (isFunction(value)) {
        const name = getMixinName(value);

        let placeholder = `${MIXIN_PREFIX}${name}${++counter}`;
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

export const addMixins = (raw, mixinsFunctions, mixins) => {
  mixins.forEach(mixin => {
    const name = `${MIXIN_PREFIX}_ADDED_${getMixinName(mixin)}`;
    raw = raw + ' ' + name;
    mixinsFunctions[name] = mixin;
  });

  return raw;
};
