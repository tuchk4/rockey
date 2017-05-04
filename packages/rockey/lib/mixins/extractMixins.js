import parse from '../css/parse';
import { generateMixinClassName, getClassName } from '../css/getClassName';
import { insertMixins } from '../styleSheets';

let queue = [];

export const insertQueuedMixins = () => {
  if (queue.length) {
    insertMixins(queue);
    queue = [];
  }
};

const createMixin = ({
  mixinClassName,
  selector,
  mixinFunc,
  root,
  forComponents,
}) => {
  let counter = 0;
  const variations = {};

  return (props, { withQueue = false, context } = {}) => {
    const raw = mixinFunc(props);
    if (!raw) {
      return null;
    }

    let variateClassName = variations[raw];

    if (!variateClassName) {
      variateClassName = `${mixinClassName}-${++counter}`;
      variations[raw] = variateClassName;
    } else {
      return {
        className: variateClassName,
        forComponents,
      };
    }

    const mixinSelector = [];
    root.forEach(n => {
      const rootComponentClassName = getClassName(n);

      selector.forEach(s => {
        mixinSelector.push(
          s.replace(
            rootComponentClassName,
            `.${variateClassName}${rootComponentClassName}`
          )
        );
      });
    });

    const { precss } = parse(raw);
    precss.forEach(p => (p.selector = mixinSelector));

    // let precss = [];
    if (withQueue) {
      queue = queue.concat(precss);
    } else {
      insertMixins(precss);
    }

    return {
      className: variateClassName,
      forComponents,
    };
  };
};

const extractMixins = (mixinsFunctions, precss) => {
  let mixins = [];

  for (let i = 0, size = precss.length; i < size; i++) {
    const part = precss[i];

    for (let j = 0, mixinsSize = part.mixins.length; j < mixinsSize; j++) {
      const mixin = part.mixins[j];
      const mixinFunc = mixinsFunctions[mixin.id];
      mixins.push(
        createMixin({
          selector: part.selector,
          root: part.root,
          forComponents: mixin.forComponents,
          mixinClassName: generateMixinClassName(mixinFunc),
          mixinFunc,
        })
      );
    }
  }

  return mixins;
};

export default extractMixins;
