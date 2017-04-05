import rule from 'rockey/rule';
import when from 'rockey/when';
import insert from 'rockey/insert';
import condition from 'rockey/condition';

import htmlTags from './htmlTags';

import rockey from './';

const createRockeyHoc = (BaseComponent, displayName, css) => {
  if (BaseComponent.extends) {
    return BaseComponent.extends(displayName, css);
  } else {
    return rockey(displayName, BaseComponent, css);
  }
};

const look = (
  BaseComponent,
  {
    extendBase = true,
  } = {}
) =>
  (...args) => {
    const css = rule(...args);

    return css.transform((tree, create) => {
      const components = Object.keys(tree.components);
      const size = components.length;

      if (!size) {
        throw new Error(
          'Rockey look should containt at least one root component'
        );
      }

      const parentDisplayName = components[0];
      const baseCss = create({
        components: {
          [parentDisplayName]: tree.components[parentDisplayName],
        },
      });

      const children = {};

      for (let i = 1; i < size; i++) {
        const displayName = components[i];

        const comopnentCss = create({
          components: {
            [displayName]: tree.components[displayName],
          },
        });

        if (extendBase) {
          comopnentCss.addParent(baseCss);
        }

        const ChildRockeyHoc = createRockeyHoc(
          BaseComponent,
          displayName,
          comopnentCss
        );

        children[displayName] = ChildRockeyHoc;
        BaseComponent[displayName] = ChildRockeyHoc;
      }

      const ParentRockeyHoc = createRockeyHoc(
        BaseComponent,
        parentDisplayName,
        baseCss
      );

      BaseComponent[parentDisplayName] = ParentRockeyHoc;

      return {
        ...children,
        [parentDisplayName]: ParentRockeyHoc,
      };
    });
  };

look.when = when;
look.condition = condition;
look.insert = insert;

for (const tag of htmlTags) {
  // ---- tag hoc lazy creation
  Object.defineProperty(look, tag, {
    get: () => (...args) => look(tag)(...args),
  });
}

export default look;
