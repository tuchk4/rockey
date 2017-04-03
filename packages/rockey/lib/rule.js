import isPlainObject from 'lodash/isPlainObject';

import parse from './css/parse';
import generateCss from './css/generateCss';
import interpolateWithMixins, {
  addMixins,
} from './mixins/interpolateWithMixins';
import extractMixins, { insertQueuedMixins } from './mixins/extractMixins';
import interpolateString from './utils/interpolateString';

import { insertRules } from './styleSheets';

export const clearStylesCache = () => {};

const css = (raw, mixinsFunctions) => {
  let parent = null;
  let isRoot = true;
  let cached = null;

  return {
    // raw() {
    //   return raw;
    // },

    // get parent() {
    //   return parent;
    // },

    wrapWith(displayName) {
      raw = `${displayName}{ ${raw} }`;
    },

    isRoot() {
      isRoot = false;
    },

    addParent(rule) {
      parent = rule;
    },

    addMixins(mixins) {
      raw = addMixins(raw, mixinsFunctions, mixins);
    },

    transform(transformFunc) {
      const parsed = parse(raw);
      return transformFunc(parsed, transformed =>
        css(
          {
            components: {},
            mixins: [],
            styles: {},
            modificators: {},
            ...transformed,
          },
          mixinsFunctions
        ));
    },

    getClassList(props = {}) {
      let parentClassList = {};

      if (parent) {
        parentClassList = parent.getClassList(props);
      }

      const parentFlatClassList = Object.keys(parentClassList).reduce(
        (classList, displayName) => {
          return classList.concat(parentClassList[displayName]);
        },
        []
      );

      let mixins = null;
      let css = null;
      let classList = null;
      let context = null;

      if (!cached) {
        const parsed = isPlainObject(raw) ? raw : parse(raw);
        mixins = extractMixins(mixinsFunctions, {
          tree: parsed,
        });

        const generated = generateCss(parsed, { isRoot });
        classList = {};

        context = generated.context;

        for (let displayName of Object.keys(generated.classNameMap)) {
          const className = generated.classNameMap[displayName];

          if (!classList[displayName]) {
            classList[displayName] = [];
            // classList[displayName] = [...parentFlatClassList];
          }

          classList[displayName].push(className);
        }

        if (Object.keys(generated.css).length) {
          insertRules(generated.css);
        }

        cached = {
          mixins,
          css,
          classList,
          context,
        };
      } else {
        mixins = cached.mixins;
        css = cached.css;
        classList = cached.classList;
        context = cached.context;
      }

      // rewrite object link to prevent original classList changing
      // when collecting mixins
      const resultClassList = Object.keys(classList).reduce(
        (mergedClassList, displayName) => {
          mergedClassList[displayName] = [
            ...classList[displayName],
            ...parentFlatClassList,
          ];

          return mergedClassList;
        },
        {}
      );

      for (let mixinComponent of Object.keys(mixins)) {
        const mixinClassNames = mixins[mixinComponent].mixins.reduce(
          (mixinClassNames, mixin) => {
            const mixinClassName = mixin(props, {
              withQueue: true,
              context,
            });

            if (mixinClassName) {
              mixinClassNames.push(mixinClassName);
            }

            return mixinClassNames;
          },
          []
        );

        // NOTE: check this
        const rootParent = mixins[mixinComponent].rootParent;
        if (resultClassList[mixinComponent]) {
          resultClassList[mixinComponent] = resultClassList[
            mixinComponent
          ].concat(mixinClassNames);
        } else if (resultClassList[rootParent]) {
          resultClassList[rootParent] = resultClassList[rootParent].concat(
            mixinClassNames
          );
        } else {
          throw new Error(
            'TODO: This case should be unreachable. Worng mixin position.'
          );
        }
      }

      insertQueuedMixins();

      return resultClassList;
    },
  };
};

export const rule = (strings, ...values) => {
  const interpolated = interpolateWithMixins(strings, ...values);

  const raw = interpolated.raw;
  const mixinsFunctions = interpolated.mixinsFunctions;

  return css(raw, mixinsFunctions);
};

export const staticRule = (strings, ...values) => {
  const raw = interpolateString(strings, ...values);
  return css(raw);
};

export default rule;
