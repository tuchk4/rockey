import createParser from 'rockey-css-parse';
import isString from 'lodash/isString';
import * as classnames from 'rockey-css-parse/utils/classnames';

import {
  getClassName,
  getAnimationName,
  getMixinClassName,
} from './css/getClassName';

import insert from './styleSheets';
import wrapTemplateStrings from './utils/wrapTemplateStrings';

import vendorPrefix from './plugins/vendorPrefix';
import validateCSSRule from './plugins/validateCSSRule';

const plugins = [];

plugins.push(vendorPrefix());

// if (process.env.NODE_ENV !== 'production') {
//   plugins.push(validateCSSRule());
// }

const parse = createParser({
  getClassName,
  getMixinClassName,
  getAnimationName,
  plugins,
});

const getSelector = classnames.getSelector(getClassName);

const merge = (classList1, classList2) => {
  Object.keys(classList2).forEach(c => {
    if (classList1[c]) {
      classList1[c] = `${classList1[c]} ${classList2[c]}`;
    } else {
      classList1[c] = classList2[c];
    }
  });

  return classList1;
};

export default function rule(raw, ...values) {
  // export default function rule(...args) {
  let parent = null;
  let parseCache = null;
  let staticClassesInserted = false;
  let isAlreadyParsed = false;
  let addedMixins = [];
  let ParentCSSVariables = {};

  if (Array.isArray(raw)) {
    isAlreadyParsed = !isString(raw[0]);

    if (isAlreadyParsed) {
      ParentCSSVariables = values[0];
    }
  } else if (isString(raw)) {
  } else {
    throw new Error('rockey-rule: wrong call type');
  }

  // const key = JSON.stringify({
  //   raw,
  //   values,
  // });

  return {
    wrapWith(displayName) {
      if (parseCache) {
        throw new Error(
          'Can not wrap because rule is already parsed and inserted'
        );
      }

      if (isAlreadyParsed) {
        const selector = getSelector(displayName);

        raw.forEach(precss => {
          precss.selector = precss.selector.map(p => `${selector} ${p}`);
          precss.root = [displayName];

          precss.mixins.forEach(m => {
            m.updateSelector(ms => `${selector} ${ms}`);
          });
        });
      } else {
        raw = wrapTemplateStrings(displayName, raw);
      }
    },

    addParent(rule) {
      parent = rule;
    },

    parse() {
      let precss = null;
      let classList = null;
      let CSSVariables = null;

      if (!parseCache) {
        if (isAlreadyParsed) {
          precss = raw;
          classList = {};
          CSSVariables = {};

          raw.forEach(part => {
            part.root.forEach(c => {
              if (!classList[c]) {
                classList[c] = getClassName(c);
              }
            });
          });
        } else {
          let parsed = parse(raw, ...values);

          precss = parsed.precss;
          classList = parsed.classList;
          CSSVariables = parsed.CSSVariables;
        }

        if (addedMixins.length) {
          Object.keys(classList).forEach(displayName => {
            addedMixins.forEach(addedMixin => {
              const css = rule`
                ${displayName} {
                  ${addedMixin}
                }
              `;

              css.parse().precss.forEach(p => {
                precss.push(p);
              });
            });
          });
        }

        parseCache = { precss, classList, CSSVariables };
      } else {
        CSSVariables = parseCache.CSSVariables;
        precss = parseCache.precss;
        classList = parseCache.classList;
      }

      return { precss, classList, CSSVariables };
    },

    transform(transformFunc) {
      let precss = {};
      let CSSVariables = ParentCSSVariables;

      if (isAlreadyParsed) {
        precss = raw;
      } else {
        const parsed = this.parse();
        precss = parsed.precss;

        CSSVariables = Object.assign({}, CSSVariables, parsed.CSSVariables);
      }

      const tree = {};

      precss.forEach(part => {
        part.root.forEach(key => {
          if (!tree[key]) {
            tree[key] = [];
          }
          tree[key].push(part);
        });
      });

      return transformFunc(tree, transformed => {
        return rule(
          Array.isArray(transformed) ? transformed : [transformed],
          CSSVariables
        );
      });
    },

    addMixins(mixins) {
      addedMixins = addedMixins.concat(mixins);
    },

    getStaticClassList() {
      let classList = {};

      if (parent) {
        classList = parent.getStaticClassList();
      }

      const parsed = this.parse();

      if (!staticClassesInserted) {
        if (parsed.precss.length) {
          insert(parsed.precss);
        }
        staticClassesInserted = true;
      }

      return merge(classList, parsed.classList);
    },

    getDynamicCSS(props = {}) {
      let classList = {};

      if (parent) {
        classList = parent.getDynamicCSS(props);
      }

      const { precss } = this.parse();
      let dynamicCSSToInsert = [];

      const appendMixins = (precss, className) => {
        for (let i = 0, s = precss.root.length; i < s; i++) {
          if (classList[precss.root[i]]) {
            classList[precss.root[i]] = `${classList[
              precss.root[i]
            ]} ${className}`;
          } else {
            classList[precss.root[i]] = className;
          }
        }
      };

      const appendCSSToInsert = precss => {
        for (let i = 0, s = precss.length; i < s; i++) {
          dynamicCSSToInsert.push(precss[i]);
        }
      };

      for (let i = 0, s = precss.length; i < s; i++) {
        const p = precss[i];
        if (p.mixins) {
          for (let j = 0, ms = p.mixins.length; j < ms; j++) {
            const mixin = p.mixins[j];
            const result = mixin(props);

            if (result) {
              if (result.className) {
                appendMixins(p, result.className);
              }

              if (result.precss) {
                appendCSSToInsert(result.precss);
              }
            }
          }
        }
      }

      if (dynamicCSSToInsert.length) {
        insert(dynamicCSSToInsert);
      }

      return classList;
    },

    getCSSVariables(props = {}) {
      let CSSVariables = {};

      if (parent) {
        CSSVariables = parent.getCSSVariables(props);
      }

      const parsed = this.parse();

      const CSSVariablesFunctions = Object.assign(
        {},
        ParentCSSVariables,
        parsed.CSSVariables
      );

      const variables = Object.keys(CSSVariablesFunctions);

      for (let i = 0, s = variables.length; i < s; i++) {
        const f = CSSVariablesFunctions[variables[i]];
        CSSVariables[variables[i]] = f(props);
      }

      return CSSVariables;
    },

    getClassList(props = {}) {
      const staticClassList = this.getStaticClassList();
      const dynamicClassList = this.getDynamicCSS(props);
      const CSSVariables = this.getCSSVariables(props);

      return Object.assign({}, staticClassList);
    },
  };
}
