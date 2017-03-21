import rule from 'rockey/rule';
import when from 'rockey/when';
import insert from 'rockey/insert';
import condition from 'rockey/condition';

import htmlTags from './htmlTags';

import RockeyHoc from './';

const look = BaseComponent =>
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
      const parentCss = create({
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
        comopnentCss.addParent(parentCss);

        children[displayName] = RockeyHoc(BaseComponent, {
          displayName,
          parentCss: comopnentCss,
        });
      }

      return {
        ...children,
        [parentDisplayName]: RockeyHoc(BaseComponent, {
          displayName: parentDisplayName,
          parentCss: parentCss,
        }),
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
