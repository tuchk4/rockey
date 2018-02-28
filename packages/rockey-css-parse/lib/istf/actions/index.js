import {
  SELECTOR,
  RULE_START,
  RULE_END,
  SPACE_COMBINATOR,
  PROPERTY,
  VALUE,
  CONDITION,
  PARENT_SELECTOR,
} from '../istf';

export function selectorStart(context) {
  if (!context.ruleStarted) {
    context.ruleStarted = true;
    context.appendIstf(RULE_START, 1);
  }
}

export function selectorEnd(context) {
  context.trim();
  context.selectors.push(context.buffer);
  context.appendIstf(SELECTOR, context.buffer);
  context.clear();
}

export function multipleSelector(context) {
  context.clear();
}

export function nestedSelector(context, char) {
  context.appendIstf(SPACE_COMBINATOR);
  context.clear();
}

export function propertyStart(context) {
  context.trim();
  // context.clear();
}

export function propertyEnd(context) {
  context.appendIstf(PROPERTY, context.buffer);
  context.clear();
}

export function valueStart(context) {
  context.trim();
}

export function valueEnd(context) {
  context.appendIstf(VALUE, context.buffer);
  context.clear();
}

export function declarationStart(context) {
  context.clear();
}

export function declarationEnd(context) {
  if (context.depth + 1 < context.istf.length) {
    context.appendIstf(RULE_START);
    context.appendIstf(1);
    context.appendIstf(PARENT_SELECTOR);
    // console.log(context.istf.length);
    // console.log(context.istf[context.depth + 1]);
    context.istf[context.depth + 1].forEach(c => {
      context.istf[context.depth].push(c);
    });
    // context.istf[context.depth] = context.istf[context.depth].concat(
    //   context.istf[context.depth + 1]
    // );
    context.istf.length = context.depth + 1;
  }

  context.appendIstf(RULE_END);
  context.ruleStarted = false;
  context.clear();
  // console.log(context.istf.length);
}

export function nestedDefinition(context) {
  context.clear();
}

// @media
export function conditionStart(context) {
  context.clear();
  context.appendIstf(RULE_START, 1);
}

export function conditionEnd(context) {
  context.appendIstf(CONDITION, context.buffer);
  context.clear();
}
