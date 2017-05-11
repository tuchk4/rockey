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
  let className = null;

  let componentName = null;
  let rest = '';
  let matches = COMPONENT_NAME_REG_EXP.exec(displayName);

  if (!matches) {
    componentName = displayName;
  } else {
    componentName = matches[1];
    rest = matches[2];
  }

  if (classNameGetter) {
    className = classNameGetter(componentName) + rest;
  } else {
    className = componentName + rest;
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
export function getMixinClassName(getMixinClassName) {
  return func => getMixinClassName(extractMixinName(func));
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
