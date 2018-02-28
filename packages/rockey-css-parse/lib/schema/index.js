import { createStep, step } from 'rockster/schema';
export {
  rule,
  branch,
  label,
  step,
  link,
  block,
  Schema,
} from 'rockster/schema';

import { ALPHABETICAL } from './markers';

const belongsAlphabetical = char => {
  const code = char.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
};

export const clear = context => context.clear();

export const clearStep = createStep(config => ({
  onEnter: clear,
}));

export const alphabetical = (selectorStart, selectorEnd) =>
  step(ALPHABETICAL, {
    onEnter: selectorStart,
    onLeave: selectorEnd,
    belongs: belongsAlphabetical,
  });

const SELECTOR_REGEXP = /^([a-z|.|:|#])[a-z|0-9]+(-[a-z|0-9]+)?$/;
export const selector = (marker, selectorStart, selectorEnd) =>
  step(marker, {
    onEnter: selectorStart,
    onLeave: selectorEnd,
    belongs: belongsAlphabetical,
    validate: (context, throwSyntaxError) => {
      if (!SELECTOR_REGEXP.test(context.buffer.trim())) {
        throwSyntaxError(
          `CSS Selector should conatin only "a-z" and "-" symbols. "${context.buffer.trim()}"`
        );
      }
    },
  });

const PROPERTY_REGEXP = /^[a-z]+(-[a-z]+)?$/;
export const property = (onEnter, onLeave) =>
  step(ALPHABETICAL, {
    onEnter,
    onLeave,
    belongs: belongsAlphabetical,
    validate: (context, throwSyntaxError) => {
      if (!PROPERTY_REGEXP.test(context.buffer.trim())) {
        throwSyntaxError(
          'CSS Property should conatin only "a-z" and "-" symbols'
        );
      }
    },
  });

const VALUE_REGEXP = /^[a-z]+(-[a-z]+)?$/;
export const propertyValue = (onEnter, onLeave) =>
  step(ALPHABETICAL, {
    onEnter,
    onLeave,
    validate: (context, throwSyntaxError) => {
      if (!VALUE_REGEXP.test(context.buffer.trim())) {
        throwSyntaxError(
          'CSS Property Value should conatin only "a-z" and "-" symbols'
        );
      }
    },
    // validate: (char, throwSyntaxError) => {
    //   const code = char.charCodeAt(0);
    //   const isValidSymbol =
    //     // a-z
    //     (code >= 97 && code <= 122) ||
    //     // 0-9
    //     (code >= 48 && code <= 57) ||
    //     // _
    //     code === 45 ||
    //     // #
    //     code === 35;

    //   if (!isValidSymbol) {
    //     throwSyntaxError(
    //       'CSS Property Value should conatin only "a-z" and "-" symbols'
    //     );
    //   }
    // },
  });
