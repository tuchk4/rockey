import { SELECTOR_SEPARATORS } from '../QuickContext';

export const selectorStart = context => {
  // if (!context.ruleStarted) {
  //   context.startRule();
  // }
};

export const selectorEnd = context => {
  context.addSelector(context.buffer.trim());
  context.clear();
};

export const selectorComaSeparated = context => {
  context.selectorSeparator = SELECTOR_SEPARATORS.COMMA;
  context.clear();
};

export const pseudoSelector = context => {
  context.selectorSeparator = SELECTOR_SEPARATORS.PSEUDO;
};

export const withParentSelector = context => {
  context.clear();
  context.selectorSeparator = SELECTOR_SEPARATORS.WITH_PARENT;
};

export const selectorSpaceSeparated = context => {
  context.selectorSeparator = SELECTOR_SEPARATORS.SPACE;
  context.clear();
};

// declaraion
export const declarationStart = context => {
  context.selectorSeparator = SELECTOR_SEPARATORS.NONE;
  context.clear();
  context.appendCSS('{');
};

export const declarationEnd = context => {
  context.appendCSS('}');
  context.clear();
  // context.endRule();
};

// prop
export const propertyStart = context => {};

export const propertyEnd = context => {
  context.property = context.buffer.trim();
  context.clear();
};

// value
export const valueStart = context => {};

export const valueEnd = context => {
  context.trim();
  context.hasProperties = true;

  context.appendCSS(`${context.property}:${context.buffer};`);
  context.clear();
  context.property = '';
};

export const startChildWithPseudo = context => {};
export const endChildWithPseudo = context => {};
