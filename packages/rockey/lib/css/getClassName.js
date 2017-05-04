import hash from '../utils/hash';

let componentsClassList = {};

const generateClassName = displayName => `${displayName}-${hash()}`;

export const clearCachedClassNames = () => {
  componentsClassList = {};
};

const rexp = /([^\.#\[]+)((\.|#|\[).+)/;

export const getComponentName = displayName => {
  let componentName = null;
  let matches = rexp.exec(displayName);
  if (!matches) {
    componentName = displayName;
  } else {
    componentName = matches[1];
  }

  return componentName;
};

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

  if (!componentsClassList[componentName]) {
    componentsClassList[componentName] = generateClassName(componentName);
  }

  className = componentsClassList[componentName] + rest;

  return parent ? `${parent} ${pre}.${className}` : `${pre}.${className}`;
};

export default getClassName;

// let mixinCounter = 0;
export const generateMixinClassName = mixinFunc => {
  const mixinName = mixinFunc.displayName || mixinFunc.name || 'anon';
  return `mixin-${mixinName}-${hash()}`;
};

export const generateAnimationName = animationName =>
  `${animationName}-${hash()}`;

export const getSelector = (displayName, parent, mixin) => {
  let pre = '';
  if (displayName[0] === '+' || displayName[0] === '~') {
    pre = displayName[0];
    displayName = displayName.slice(1);
  }

  if (
    displayName[0] !== '.' &&
    displayName[0] !== '#' &&
    displayName[0] !== ':' &&
    displayName[0] !== '*' &&
    displayName[0] !== '[' &&
    displayName[0] !== '@' &&
    displayName[0] === displayName[0].toUpperCase()
  ) {
    return `${mixin || ''}${getClassName(displayName, parent, pre)}`;
  } else {
    return `${mixin || ''}${parent ? `${parent} ${pre}${displayName}` : `${pre}${displayName}`}`;
  }
};
