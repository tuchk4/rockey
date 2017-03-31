import mergeCss from './utils/mergeCss';

import {
  getClassName,
  getRootClassNameMap,
  generateAnimationName,
} from './getClassName';

const getSelector = (displayName, parent, mixin) => {
  if (
    displayName[0] !== '[' &&
    displayName[0] !== ':' &&
    displayName[0] !== '.' &&
    displayName[0] !== '#' &&
    displayName[0] === displayName[0].toUpperCase()
  ) {
    return `${mixin || ''}${getClassName(displayName, parent)}`;
  } else {
    return `${mixin || ''}${parent ? `${parent} ${displayName}` : `${displayName}`}`;
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

function processModificators(
  tree,
  {
    parent,
    context,
  }
) {
  const css = {};

  for (const modificatorKey of Object.keys(tree.modificators)) {
    const modificator = tree.modificators[modificatorKey];

    if (isMedia(modificatorKey)) {
      css[modificatorKey] = generateCss(modificator, {
        parent,
      });

      if (Object.keys(modificator.styles).length) {
        css[modificatorKey][parent] = modificator.styles;
      }
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

      // merge?
      if (Object.keys(modificator.styles).length) {
        css[`${parent}${updatedModificatorKey}`] = process(
          modificator.styles,
          context
        );
      }

      Object.assign(
        css,
        generateCss(modificator, {
          parent: `${parent}${updatedModificatorKey}`,
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
      })
    );
  }

  for (const className of Object.keys(tree.components)) {
    const component = tree.components[className];
    const selector = getSelector(className, parent, mixin);

    mergeCss(
      css,
      generateCss(component, {
        parent: selector,
        context,
      })
    );

    if (Object.keys(component.styles).length) {
      css[selector] = process(component.styles, context);
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
        mixin,
        context,
      })
    ),
    context,
    classNameMap: classNameMap,
  };
};
