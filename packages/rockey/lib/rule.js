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

export default function rule(raw, ...values) {
  // export default function rule(...args) {
  let parent = null;
  let cached = null;
  let inserted = false;
  let isAlreadyParsed = false;
  let addedMixins = [];

  if (Array.isArray(raw)) {
    isAlreadyParsed = !isString(raw[0]);
  } else if (isString(raw)) {
  } else {
    throw new Error('rockey-rule: wrong call type');
  }

  const key = JSON.stringify({
    raw,
    values,
  });

  return {
    wrapWith(displayName) {
      if (cached) {
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

      if (!cached) {
        if (isAlreadyParsed) {
          precss = raw;
          classList = {};

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

              // precss = precss.concat(css.parse().precss);
            });
          });
        }

        cached = {
          precss,
          classList,
        };
      } else {
        precss = cached.precss;
        classList = cached.classList;
      }

      return { precss, classList };
    },

    transform(transformFunc) {
      let precss = {};

      if (isAlreadyParsed) {
        precss = raw;
      } else {
        const parsed = this.parse();
        precss = parsed.precss;
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
        return rule(Array.isArray(transformed) ? transformed : [transformed]);
      });
    },

    addMixins(mixins) {
      addedMixins = addedMixins.concat(mixins);
    },

    getClassList(props = {}) {
      let parentClasses = [];

      if (parent) {
        const parentClassList = parent.getClassList(props);
        Object.keys(parentClassList).forEach(name => {
          parentClasses.push(parentClassList[name]);
        });
      }

      const { classList, precss } = this.parse();

      if (!inserted) {
        if (precss.length) {
          insert(precss);
        }

        inserted = true;
      }

      let resultClassList = {};

      if (parent) {
        let parentClassList = parentClasses.join(' ');
        if (parentClassList) {
          Object.keys(classList).forEach(name => {
            resultClassList[name] = `${classList[name]} ${parentClassList}`;
          });
        }
      } else {
        resultClassList = Object.assign({}, classList);
      }

      let mixinsPrecss = [];

      precss.forEach(pre => {
        if (pre.mixins) {
          pre.mixins.forEach(mixin => {
            const result = mixin(props);

            if (result) {
              if (result.className) {
                pre.root.forEach(c => {
                  resultClassList[c] += ` ${result.className}`;
                });
              }

              if (result.precss) {
                result.precss.forEach(p => {
                  mixinsPrecss.push(p);
                });
              }
            }
          });
        }
      });

      if (mixinsPrecss.length) {
        insert(mixinsPrecss);
      }

      return resultClassList;
    },
  };
}
