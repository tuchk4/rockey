import isFunction from 'lodash/isFunction';

export default function interpolateString(strings, ...values) {
  const mixins = {};

  let raw = '';

  strings.forEach((part, i) => {
    let name = `@mixin${i}`;

    if (isFunction(values[i])) {
      mixins[name] = values[i];
      return raw + part + name;
    } else {
      return raw + part + (values[i] || '');
    }
  });

  return {
    raw,
    mixins,
  };
}
