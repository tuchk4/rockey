import hash from '../utils/hash';

let componentsClassList = new Map();

// For correct styling - this Map should be empty when App is loaded.
// If not - styles are wrong
let notYetDefinedAtRootClassList = new Map();

const generateClassName = displayName => `${displayName}-${hash()}`;

export const clearCachedClassNames = () => {
  componentsClassList = new Map();
  notYetDefinedAtRootClassList = new Map();
};

export const getNotYetDefiendComponents = () => {
  const components = [];
  notYetDefinedAtRootClassList.forEach((className, displayName) =>
    components.push(displayName));

  return components;
};

const rexp = /([^\.#\[]+)((\.|#|\[).+)/;

export const getClassName = (displayName, parent, pre = '') => {
  let className = null;

  // pre calc cache check
  // if (componentsClassList.has(displayName)) {
  //   className = componentsClassList.get(displayName);
  //   return parent ? `${parent} ${pre}.${className}` : `${pre}.${className}`;
  // }

  let componentName = null;
  let rest = '';
  let matches = rexp.exec(displayName);
  if (!matches) {
    componentName = displayName;
  } else {
    componentName = matches[1];
    rest = matches[2];
  }

  if (!componentsClassList.has(componentName)) {
    if (notYetDefinedAtRootClassList.has(componentName)) {
      className = notYetDefinedAtRootClassList.get(componentName);
    } else {
      className = generateClassName(componentName, false);
      notYetDefinedAtRootClassList.set(componentName, className);
    }
  } else {
    className = componentsClassList.get(componentName);
  }

  className += rest;

  return parent ? `${parent} ${pre}.${className}` : `${pre}.${className}`;
};

export default getClassName;

export const getRootClassNameMap = (tree, { isRoot }) => {
  const classNameMap = {};

  // Root components should be unique
  // Two cases of Root Component className generation:
  // - at getRootClassNameMap function
  // - at getClassName if Comopnent is described as child at another root component
  for (const displayName of Object.keys(tree.components)) {
    if (!componentsClassList.has(displayName)) {
      let className = null;
      if (notYetDefinedAtRootClassList.has(displayName)) {
        className = notYetDefinedAtRootClassList.get(displayName);
        notYetDefinedAtRootClassList.delete(displayName);
      } else {
        className = generateClassName(displayName);
      }

      classNameMap[displayName] = className;
      componentsClassList.set(displayName, className);
    } else {
      if (isRoot) {
        console.warn(
          `(generate error) "${displayName}" was already defined as root component`
        );
      }

      classNameMap[displayName] = componentsClassList.get(displayName);
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
