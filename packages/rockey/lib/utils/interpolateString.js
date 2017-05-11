import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';

const interpolateString = (strings, ...values) => {
  return strings
    .reduce((rule, part, i) => {
      if (values[i] && !isString(values[i]) && !isNumber(values[i])) {
        throw new Error('Static rule should not contain mixins');
      }

      return rule + part + (values[i] || '');
    }, '')
    .replace(/\r|\n/g, '')
    .replace(/\s+/g, ' '); // hm?
};

export default interpolateString;
