import { SELECTOR_SEPARATORS, SELECTOR_TYPES } from '../NativeContext';

export function startTagSelector(context) {
  context.selectorType = SELECTOR_TYPES.TAG;
}

export function startClassSelector(context) {
  context.selectorType = SELECTOR_TYPES.CLASS;
}

export function startIdSelector(context) {
  context.selectorType = SELECTOR_TYPES.ID;
}

export function startPseudoSelector(context) {
  context.selectorType = SELECTOR_TYPES.PSEUDO;
}

export function selectorEnd(context) {
  context.addSelector(context.buffer.trim());
  context.clear();
}

export function selectorComaSeparated(context) {
  context.selectorSeparator = SELECTOR_SEPARATORS.COMMA;
  context.clear();
}

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
