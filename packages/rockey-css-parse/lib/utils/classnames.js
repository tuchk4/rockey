const COMPONENT_NAME_REG_EXP = /([^\.#\[:]+)((\.|#|\[|:).+)/;

function isPlainSelector(displayName) {
  return (
    displayName[0] === '.' ||
    displayName[0] === '#' ||
    displayName[0] === ':' ||
    displayName[0] === '*' ||
    displayName[0] === '[' ||
    displayName[0] === '@' ||
    displayName[0] === displayName[0].toLowerCase()
  );
}

function processClassName(classNameGetter, displayName) {
  const parts = displayName.split(' ');

  let className = null;
  let componentName = null;
  let rest = '';

  let displayNamePart = parts.shift();
  const inlineChild = parts.join(' ');

  let matches = COMPONENT_NAME_REG_EXP.exec(displayNamePart);

  if (!matches) {
    componentName = displayNamePart;
  } else {
    componentName = matches[1];
    rest = matches[2];
  }

  if (classNameGetter) {
    className =
      classNameGetter(componentName) +
      rest +
      (inlineChild ? ` ${inlineChild}` : '');
  } else {
    className = componentName + rest + (inlineChild ? ` ${inlineChild}` : '');
  }

  return className;
}

export function getSelector(classNameGetter) {
  return displayName => {
    let pre = '';

    if (displayName[0] === '+' || displayName[0] === '~') {
      pre = displayName[0];
      displayName = displayName.slice(1).trim();
    }

    if (isPlainSelector(displayName)) {
      return pre + displayName;
    }

    return `${pre}.${processClassName(classNameGetter, displayName)}`;
  };
}

export function getClassName(classNameGetter) {
  return displayName => {
    if (isPlainSelector(displayName)) {
      return displayName;
    }

    return processClassName(classNameGetter, displayName);
  };
}

const extractMixinName = mixinFunc =>
  mixinFunc.displayName || mixinFunc.name || 'anon';

let mixinCounter = 0;
export function getMixinClassName(
  mixinClassNameGetter = name => `m-${name}-${++mixinCounter}`
) {
  return func => mixinClassNameGetter(extractMixinName(func));
}

// cut mixed classnames or identifiers
export function getComponentName(displayName) {
  let componentName = null;
  let matches = COMPONENT_NAME_REG_EXP.exec(displayName);
  if (!matches) {
    componentName = displayName;
  } else {
    componentName = matches[1];
  }

  return componentName;
}
