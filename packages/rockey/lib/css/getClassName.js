import hash from '../utils/hash';

let componentsClassList = {};

const generateClassName = displayName => `${displayName}-${hash()}`;

export const clearCachedClassNames = () => {
  componentsClassList = {};
};

export function getClassName(component) {
  if (!componentsClassList[component]) {
    componentsClassList[component] = generateClassName(component);
  }

  return componentsClassList[component];
}

export function getMixinClassName(mixinName) {
  return `m-${mixinName}-${hash()}`;
}

export const getAnimationName = animationName => `${animationName}-${hash()}`;
