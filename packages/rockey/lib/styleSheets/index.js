import StyleSheet from './StyleSheet';
import { insertRule } from './utils/CSSStyleSheetFragments';

const sheet = new StyleSheet();

export const insert = precss => {
  sheet.insert(precss);
};

export const createDynamicRule = className => {
  if (!className) {
    throw new Error('classname should be defined for createDynamicRule');
  }

  const rule = insertRule(`.${className} {}`);

  return {
    update: rules => {
      const vars = Object.keys(rules);

      for (let i = 0, s = vars.length; i < s; i++) {
        rule.style.setProperty(vars[i], rules[vars[i]]);
      }
    },
  };
};

export default insert;
