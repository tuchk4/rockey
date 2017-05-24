import createMixin from './createMixin';

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
          mixinFunc,
        })
      );
    }
  }

  return mixins;
};

export default extractMixins;
