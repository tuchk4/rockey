import mergeCss from './utils/mergeCss';

import {
  getClassName,
  getRootClassNameMap,
  generateAnimationName,
} from './getClassName';

const getSelector = (displayName, parent, mixin) => {
  let pre = '';
  if (displayName[0] === '+' || displayName[0] === '~') {
    pre = displayName[0];
    displayName = displayName.slice(1);
  }

  if (
    displayName[0] !== '[' &&
    displayName[0] !== '@' &&
    displayName[0] !== ':' &&
    displayName[0] !== '.' &&
    displayName[0] !== '#' &&
    displayName[0] === displayName[0].toUpperCase()
  ) {
    return `${mixin || ''}${getClassName(displayName, parent, pre)}`;
  } else {
    return `${mixin || ''}${parent ? `${parent} ${pre}${displayName}` : `${pre}${displayName}`}`;
  }
};

const isMedia = key => key.indexOf('@media') === 0;
const isKeyFrames = key => key.indexOf('@keyframes') === 0;
const isNot = key => key.indexOf(':not') === 0;

// TODO: remove code duplic.
function process(styles, context) {
  let processed = styles;

  if (styles['animation-name']) {
    processed = { ...styles };

    let animationName = styles['animation-name'];
    if (!context.animations[animationName]) {
      if (animationName !== 'none' && animationName.indexOf('none ') !== 0) {
        console.warn(
          `(generate error) "${animationName}" animation was requested but had not been defined`
        );

        delete processed['animation-name'];
      }
    } else {
      processed['animation-name'] = context.animations[animationName];
    }
  } else if (styles['animation']) {
    processed = { ...styles };

    let animationName = styles['animation'].split(' ')[0];

    if (!context.animations[animationName]) {
      if (animationName !== 'none') {
        console.warn(
          `(generate error) "${animationName}" animation was requested but had not been defined`
        );

        delete processed.animation;
      }
    } else {
      processed['animation'] = styles['animation'].replace(
        animationName,
        context.animations[animationName]
      );
    }
  }

  return processed;
}

function combineSelector(selector, parentClassName, parents) {
  let key = `${selector}`;

  if (parents.length && parentClassName) {
    const regexp = new RegExp(parentClassName, 'g');
    parents.forEach(p => {
      key += `, ${selector.replace(regexp, getSelector(p))}`;
    });
  }

  return key;
}

function updateCombinedComponents(className, iteration1, iteration2) {
  let combined = combineSelector(
    className,
    iteration1.parentClassName,
    iteration1.parents
  );
  combined = combineSelector(
    combined,
    iteration2.parentClassName,
    iteration2.parents
  );

  return combined;
}

function processModificators(
  tree,
  {
    parent,
    parents = [],
    parentClassName,
    context,
  }
) {
  const css = {};

  for (const modificatorKey of Object.keys(tree.modificators)) {
    const modificator = tree.modificators[modificatorKey];

    if (isMedia(modificatorKey)) {
      css[modificatorKey] = generateCss(modificator, {
        parent,
        parents,
        parentClassName,
        context,
      });

      const combined = combineSelector(parent, parentClassName, parents);
      css[modificatorKey][combined] = modificator.styles;
    } else if (isKeyFrames(modificatorKey)) {
      let animationName = modificatorKey.split(' ')[1];

      let uniqAnimationName = generateAnimationName(animationName);
      context.animations[animationName] = uniqAnimationName;

      const keyframes = Object.keys(modificator.components).reduce(
        (steps, step) => {
          steps[step] = modificator.components[step].styles;
          return steps;
        },
        {}
      );

      css[modificatorKey.replace(animationName, uniqAnimationName)] = keyframes;
    } else {
      let updatedModificatorKey = modificatorKey;

      if (isNot(modificatorKey)) {
        const matches = modificatorKey.match(/\(([^\)]+)\)(.*)/);
        updatedModificatorKey = `:not(${getSelector(matches[1])})${matches[2]}`;
      }

      if (Object.keys(modificator.styles).length) {
        if (updatedModificatorKey.indexOf(',') !== -1) {
          const processed = process(modificator.styles, context);

          const combined = [];
          updatedModificatorKey.split(',').forEach(mod => {
            combined.push(
              combineSelector(
                `${parent}${mod.trim()}`,
                parentClassName,
                parents
              )
            );
          });

          mergeCss(css, {
            [combined.join(',')]: processed,
          });
        } else {
          const processed = process(modificator.styles, context);

          const combined = combineSelector(
            `${parent}${updatedModificatorKey}`,
            parentClassName,
            parents
          );
          mergeCss(css, {
            [combined]: processed,
          });
        }
      }

      Object.assign(
        css,
        generateCss(modificator, {
          parent: `${parent}${updatedModificatorKey}`,
          parentClassName,
          parents,
          context,
        })
      );
    }
  }

  return css;
}

function generateCss(
  tree,
  {
    parent,
    parents = [],
    parentClassName,
    parentSelector,
    mixin,
    context,
  }
) {
  const css = {};

  if (parent && Object.keys(tree.modificators)) {
    // render parent modificators
    mergeCss(
      css,
      processModificators(tree, {
        context,
        parent,
        parents: tree.combinedComponents,
        parentClassName,
      })
    );
  }

  for (const displayName of Object.keys(tree.components)) {
    const component = tree.components[displayName];
    const selector = getSelector(displayName, parent, mixin);
    const className = getSelector(displayName);

    let componentCss = generateCss(component, {
      parent: selector,
      parentClassName: className,
      parents: component.combinedComponents,
      context,
    });

    let processedComponentCss = {};
    if (parents) {
      // TODO: use reduce
      Object.keys(componentCss).forEach(key => {
        if (!isMedia(key)) {
          const combined = updateCombinedComponents(
            key,
            {
              parentClassName,
              parents,
            },
            {
              parentClassName: className,
              parents: component.combinedComponents,
            }
          );

          // let combined = combineSelector(key, parentClassName, parents);
          // combined = combineSelector(
          //   combined,
          //   className,
          //   component.combinedComponents
          // );

          processedComponentCss[combined] = componentCss[key];
        } else {
          processedComponentCss[key] = {};

          Object.keys(componentCss[key]).forEach(classNameInsideMedia => {
            // const combinedInsideMedia = updateCombinedComponents(key, parentClassName, {
            //   parents,
            //   componentParents: component.combinedComponents
            // });

            const combinedInsideMedia = updateCombinedComponents(
              classNameInsideMedia,
              {
                parentClassName,
                parents,
              },
              {
                parentClassName: className,
                parents: component.combinedComponents,
              }
            );

            processedComponentCss[key][combinedInsideMedia] = componentCss[key][
              classNameInsideMedia
            ];
          });
        }
      });

      componentCss = processedComponentCss;
    }

    mergeCss(css, componentCss);

    if (Object.keys(component.styles).length) {
      const combined = updateCombinedComponents(
        selector,
        {
          parentClassName,
          parents,
        },
        {
          parentClassName: className,
          parents: component.combinedComponents,
        }
      );

      // let combined = combineSelector(selector, parentClassName, parents);
      // combined = combineSelector(
      //   combined,
      //   className,
      //   component.combinedComponents
      // );

      css[combined] = process(component.styles, context);
    }
  }

  return css;
}

export default (
  tree,
  {
    isRoot = true,
    parent = null,
    mixin = null,
    context = {
      animations: {},
    },
  } = {}
) => {
  if (Object.keys(tree.styles).length) {
    throw new Error('(generate css) root tree should not contain styles');
  }

  const rootCss = processModificators(tree, {
    context,
    parent,
  });

  const classNameMap = getRootClassNameMap(tree, {
    isRoot,
  });

  return {
    css: mergeCss(
      rootCss,
      generateCss(tree, {
        parent,
        parents: tree.combinedComponents,
        mixin,
        context,
      })
    ),
    context,
    classNameMap: classNameMap,
  };
};
