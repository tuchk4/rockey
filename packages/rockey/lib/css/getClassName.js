import hash from '../utils/hash';

let comopnentsClassList = new Map();

// For correct styling - this Map should be empty when App is loaded.
// If not - styles are wrong
let notYetDefinedAtRootClassList = new Map();

const generateClassName = displayName => `${displayName}-${hash()}`;

export const clearCachedClassNames = () => {
  comopnentsClassList = new Map();
  notYetDefinedAtRootClassList = new Map();
};

export const getNotYetDefiendComponents = () => {
  const components = [];
  notYetDefinedAtRootClassList.forEach((className, displayName) =>
    components.push(displayName));

  return components;
};

export const getClassName = (displayName, parent) => {
  let className = null;

  if (!comopnentsClassList.has(displayName)) {
    if (notYetDefinedAtRootClassList.has(displayName)) {
      className = notYetDefinedAtRootClassList.get(displayName);
    } else {
      className = generateClassName(displayName, false);
      notYetDefinedAtRootClassList.set(displayName, className);
    }
  } else {
    className = comopnentsClassList.get(displayName);
  }

  return parent ? `${parent} .${className}` : `.${className}`;
};

export default getClassName;

export const getRootClassNameMap = (tree, { isRoot }) => {
  const classNameMap = {};

  // Root components should be unique
  // Two cases of Root Component className generation:
  // - at getRootClassNameMap function
  // - at getClassName if Comopnent is described as child at another root component
  for (const displayName of Object.keys(tree.components)) {
    if (!comopnentsClassList.has(displayName)) {
      let className = null;
      if (notYetDefinedAtRootClassList.has(displayName)) {
        className = notYetDefinedAtRootClassList.get(displayName);
        notYetDefinedAtRootClassList.delete(displayName);
      } else {
        className = generateClassName(displayName);
      }

      classNameMap[displayName] = className;
      comopnentsClassList.set(displayName, className);
    } else {
      if (isRoot) {
        console.warn(
          `(generate error) "${displayName}" was already defined as root component`
        );
      }

      classNameMap[displayName] = comopnentsClassList.get(displayName);
    }
  }

  return classNameMap;
};

// let mixinCounter = 0;
export const generateMixinClassName = mixinFunc => {
  const mixinName = mixinFunc.displayName || mixinFunc.name || 'anon';
  return `Mixin-${mixinName}-${hash()}`;
};

export const generateAnimationName = animationName =>
  `${animationName}-${hash()}`;
