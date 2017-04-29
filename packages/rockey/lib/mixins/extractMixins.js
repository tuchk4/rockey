import parse from '../css/parse';
import generateCss, { combineSelector, getSelector } from '../css/generateCss';
import { generateMixinClassName } from '../css/getClassName';
import { insertMixins } from '../styleSheets';

let queue = {};

export const insertQueuedMixins = () => {
  if (Object.keys(queue).length) {
    insertMixins(queue);
    queue = {};
  }
};

const createMixin = ({
  className,
  name,
  componentSequence,
  parents,
  mixinFunc,
}) => {
  let counter = 0;
  const variations = {}; //new Map();

  return (props, { withQueue = false, context } = {}) => {
    const raw = mixinFunc(props);
    if (!raw) {
      return null;
    }

    // if (
    //   raw.indexOf('return') !== -1 ||
    //   raw.indexOf('=>') !== -1 ||
    //   raw.indexOf('function') !== -1
    // ) {
    //   throw new Error('Mixin results should not contain other mixins');
    // }

    let variateClassName = variations[raw];

    if (!variateClassName) {
      variateClassName = `${className}-${++counter}`;
      variations[raw] = variateClassName;
    } else {
      return variateClassName;
    }

    let nesetdRaw = raw;

    for (const displayName of componentSequence.reverse()) {
      nesetdRaw = `${displayName} {${nesetdRaw}}`;
    }

    const parsed = parse(nesetdRaw);
    //
    const { css } = generateCss(parsed, {
      isRoot: false,
      mixin: '.' + variateClassName,
      context,
    });

    let combinedCss = {};

    if (Object.keys(parents).length) {
      Object.keys(css).forEach(key => {
        let combined = key;
        Object.keys(parents).forEach(parentKey => {
          combined = combineSelector(
            key,
            getSelector(parentKey),
            parents[parentKey]
          );
        });

        combinedCss[combined] = css[key];
      });
    } else {
      combinedCss = css;
    }

    if (withQueue) {
      Object.assign(queue, combinedCss);
    } else {
      insertMixins(combinedCss);
    }

    return variateClassName;
  };
};

const extractMixins = (
  mixinsFunctions,
  { displayName, tree, componentSequence = [], parents = {} }
) => {
  let mixins = {};

  for (const mixin of tree.mixins) {
    const mixinFunc = mixinsFunctions[mixin];

    if (!mixins[displayName]) {
      mixins[displayName] = {
        rootParent: componentSequence[0],
        mixins: [],
      };
    }

    mixins[displayName].mixins.push(
      createMixin({
        componentSequence,
        className: generateMixinClassName(mixinFunc),
        name: mixin,
        parents,
        mixinFunc,
      })
    );
  }

  // collect nested mixins
  for (const displayName of Object.keys(tree.components)) {
    const componentTree = tree.components[displayName];

    mixins = {
      ...mixins,
      ...extractMixins(mixinsFunctions, {
        displayName,
        tree: componentTree,
        // parents: parents.concat(componentTree.combinedComponents),
        parents: {
          ...parents,
          ...componentTree.combinedComponents.reduce((parents, parent) => {
            if (!parents[displayName]) {
              parents[displayName] = [];
            }

            parents[displayName].push(parent);
            return parents;
          }, {}),
        },
        componentSequence: componentSequence.concat(displayName),
      }),
    };
  }

  // collect nested mixins
  for (const displayName of Object.keys(tree.modificators)) {
    const modificatorTree = tree.modificators[displayName];

    mixins = {
      ...mixins,
      ...extractMixins(mixinsFunctions, {
        displayName,
        tree: modificatorTree,
        parents: {
          ...parents,
          ...modificatorTree.combinedComponents.reduce((parents, parent) => {
            if (!parents[displayName]) {
              parents[displayName] = [];
            }

            parents[displayName].push(parent);
            return parents;
          }, {}),
        },
        componentSequence: componentSequence.concat(displayName),
      }),
    };
  }

  return mixins;
};

export default extractMixins;
