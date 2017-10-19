import isFunction from 'lodash/isFunction';
import camelCase from 'lodash/camelCase';

const USE_CSS_VARIABLES = false;

const MIXIN_PREFIX = '|MIXIN_';
const getMixinName = mixinFunc => mixinFunc.displayName || mixinFunc.name;

let counter = 0;

const interpolateWithMixins = (strings, ...values) => {
  const mixinsFunctions = {
    CSSVariables: {},
  };

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

      let id = counter === 0 ? '' : counter;
      counter++;

      const placeholder = `${MIXIN_PREFIX}${name}${id}`;

      if (found) {
        if (USE_CSS_VARIABLES) {
          const CSSVariable = `${name}${id}`;
          const CSSVariableMixin = (...args) => {
            return value(...args);
          };

          CSSVariableMixin.CSSVariable = CSSVariable;

          mixinsFunctions.CSSVariables[CSSVariable] = CSSVariableMixin;
          append = ` ${prop}: var(--${CSSVariable}); `;
        } else {
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
          append = `${placeholder} `;
        }
      } else {
        mixinsFunctions[placeholder] = value;

        append = `${placeholder} `;
      }
    }

    return rule + raw + ' ' + append;
  }, '');

  return { raw, mixinsFunctions };
};

export default interpolateWithMixins;
