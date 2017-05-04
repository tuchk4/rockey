import parse from './css/parse';
import interpolateWithMixins, {
  addMixins,
} from './mixins/interpolateWithMixins';
import extractMixins, { insertQueuedMixins } from './mixins/extractMixins';
import { getClassName } from './css/getClassName';
import interpolateString from './utils/interpolateString';

import { insertRules } from './styleSheets';

export const clearStylesCache = () => {};

const css = (raw, mixinsFunctions) => {
  let parent = null;
  let cached = null;
  let lastInserted = null;

  return {
    get raw() {
      return raw;
    },

    get mixins() {
      return mixinsFunctions;
    },

    wrapWith(displayName) {
      if (Array.isArray(raw)) {
        // NOTE: test this case
        const className = getClassName(displayName);

        raw.forEach(part => {
          part.selector = `.${className} ${part.selector}`;
          part.root = displayName;
        });
      } else {
        raw = `${displayName}{ ${raw} }`;
      }
    },

    addParent(rule) {
      parent = rule;
    },

    addMixins(mixins) {
      raw = addMixins(raw, mixinsFunctions, mixins);
    },

    transform(transformFunc) {
      const { precss } = parse(raw);
      const tree = {};

      precss.forEach(part => {
        part.root.forEach(key => {
          if (!tree[key]) {
            tree[key] = [];
          }
          tree[key].push(part);
        });
      });

      return transformFunc(tree, transformed =>
        css(transformed, mixinsFunctions)
      );
    },

    getClassList(props = {}) {
      let parentClasses = [];

      if (parent) {
        const parentClassList = parent.getClassList(props);
        Object.keys(parentClassList).forEach(name => {
          parentClasses.push(parentClassList[name]);
        });
      }

      let mixins = null;
      let precss = null;
      let classList = null;
      let context = null;

      if (!cached) {
        if (Array.isArray(raw)) {
          precss = raw;
          classList = {};

          raw.forEach(part => {
            part.root.forEach(c => {
              if (!classList[c]) {
                classList[c] = getClassName(c).slice(1);
              }
            });
          });
        } else {
          const parsed = parse(raw);
          precss = parsed.precss;
          classList = parsed.classList;
        }

        mixins = extractMixins(mixinsFunctions, precss);

        if (Object.keys(precss).length) {
          insertRules(precss);
        }

        cached = {
          mixins,
          precss,
          classList,
          context,
        };
      } else {
        mixins = cached.mixins;
        precss = cached.precss;
        classList = cached.classList;
        context = cached.context;
      }

      let resultClassList = {};

      if (parent) {
        resultClassList = {};

        Object.keys(classList).forEach(name => {
          resultClassList[name] = [classList[name], ...parentClasses];
        });
      } else {
        resultClassList = Object.assign({}, classList);
      }

      mixins.forEach(mixin => {
        const { className, forComponents } = mixin(props, {
          withQueue: true,
          context,
        });

        if (className) {
          forComponents.forEach(c => {
            resultClassList[c] += ` ${className}`;
          });
        }
      });

      insertQueuedMixins();

      lastInserted = resultClassList;
      return resultClassList;
    },

    getLastInserted() {
      return lastInserted;
    },
  };
};

export const rule = (strings, ...values) => {
  const { raw, mixinsFunctions } = interpolateWithMixins(strings, ...values);

  return css(raw, mixinsFunctions);
};

export const staticRule = (strings, ...values) => {
  const raw = interpolateString(strings, ...values);
  return css(raw);
};

export default rule;
