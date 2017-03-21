import parse from '../css/parse';
import generateCss from '../css/generateCss';
import { getClassName, generateMixinClassName } from '../css/getClassName';
import { insertMixins } from '../styleSheets';

let queue = {};

export const insertQueuedMixins = () => {
  if (Object.keys(queue).length) {
    insertMixins(queue);
    queue = {};
  }
};

const createMixin = ({ className, name, componentSequence, mixinFunc }) => {
  let counter = 0;
  const variations = new Map();

  return (props, { withQueue = false, context } = {}) => {
    const raw = mixinFunc(props);
    let variateClassName = variations.get(raw);

    if (!variateClassName) {
      variateClassName = `${className}-${++counter}`;
      variations.set(raw, variateClassName);
    } else {
      return variateClassName;
    }

    if (!raw) {
      return null;
    }

    let nesetdRaw = raw;

    for (const displayName of componentSequence.reverse()) {
      nesetdRaw = `${displayName} {${nesetdRaw}}`;
    }

    const parsed = parse(nesetdRaw);

    const { css } = generateCss(parsed, {
      isRoot: false,
      mixin: '.' + variateClassName,
      context,
    });

    if (withQueue) {
      Object.assign(queue, css);
    } else {
      insertMixin(css);
    }

    return variateClassName;
  };
};

const extractMixins = (
  mixinsFunctions,
  {
    displayName,
    tree,
    componentSequence = [],
  }
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
        componentSequence: componentSequence.concat(displayName),
      }),
    };
    // mixins = mixins.concat(
    //   extractMixins(
    //     mixinsFunctions,
    //     component,
    //     componentSequence.concat(displayName)
    //   )
    // );
  }

  return mixins;
};

export default extractMixins;
