// const validateRule = (rule, value) => {};
// const autoprefixRule = (rule, value) => {};

const cache = new Map();

const parseCss = styles => {
  const stylesParts = styles
    .trim()
    .split(';')
    .map(s => s ? s.split(':') : null)
    .filter(s => !!s);

  const key = stylesParts.toString();

  if (!key.trim()) {
    return {};
  }

  if (cache.has(key)) {
    return cache.get(key);
  }

  const stylesJson = stylesParts.reduce(
    (json, value) => {
      if (value) {
        const key = value[0].trim();
        if (json[key]) {
          // css fallback values
          let prev = Array.isArray(json[key]) ? json[key] : [json[key]];

          json[value[0].trim()] = prev.concat([
            value.slice(1).join(':').trim(),
          ]);
        } else {
          json[value[0].trim()] = value.slice(1).join(':').trim();
        }

        // validateRule(value[0], json[value[0]]);
        // json[value[0].trim()] = autoprefixRule(value.slice(1).join(':').trim());
      }
      return json;
    },
    {}
  );

  cache.set(key, stylesJson);

  return stylesJson;
};

// @replace-start
const isModificatorStartSymbol = symbol => {
  return symbol === '@' || symbol === ':';
};
// @replace-end

// @replace-start
const isModificatorEndSymbol = symbol => {
  return symbol === '{' || symbol === ';';
};
// @replace-end

const isStartsWithModificator = raw => {
  return 0 === raw.indexOf('@media') ||
    0 === raw.indexOf('@keyframes') ||
    0 === raw.indexOf(':before') ||
    0 === raw.indexOf(':after') ||
    0 === raw.indexOf(':disabled') ||
    0 === raw.indexOf(':hover') ||
    0 === raw.indexOf(':link') ||
    0 === raw.indexOf(':active') ||
    0 === raw.indexOf(':visited') ||
    0 === raw.indexOf(':nth') ||
    0 === raw.indexOf('::first-line') ||
    0 === raw.indexOf(':not');
};

const parse = (raw, parent) => {
  let openedBrackets = 0;
  let openedModificatorBrackets = 0;
  let styles = '';

  let component = null;
  let components = {};

  let possibleModificator = 0;
  let modificators = {};
  let modificator = '';

  let current = '';
  let currentBackup = '';

  // @replace-start
  const restore = () => {
    current = currentBackup + current;
    currentBackup = '';
  };
  // @replace-end

  // @replace-start
  const clearAndRestore = () => {
    current = currentBackup;
    currentBackup = '';
  };
  // @replace-end

  // @replace-start
  const backup = () => {
    currentBackup = current;
    current = '';
  };
  // @replace-end

  // @replace-start
  const possibleModificatorStart = () => {
    possibleModificator = true;
  };
  // @replace-end

  // @replace-start
  const isPossibleModificator = () => {
    return possibleModificator;
  };
  // @replace-end

  // @replace-start
  const possibleModificatorEnd = () => {
    possibleModificator = false;
  };
  // @replace-end

  // @replace-start
  const isModificator = () => {
    return isStartsWithModificator(current.trim());
  };
  // @replace-end

  // @replace-start
  const openBracket = () => {
    openedBrackets++;
  };
  // @replace-end

  // @replace-start
  const closeBracket = () => {
    openedBrackets--;
  };
  // @replace-end

  // @replace-start
  const isAllBracketsClosed = () => {
    return openedBrackets === 0;
  };
  // @replace-end

  // @replace-start
  const openModificatorBracket = () => {
    openedModificatorBrackets++;
  };
  // @replace-end

  // @replace-start
  const closeModificatorBracket = () => {
    openedModificatorBrackets--;
  };
  // @replace-end

  // @replace-start
  const isAllModificatorBracketsClosed = () => {
    return openedModificatorBrackets === 0;
  };
  // @replace-end

  // @replace-start
  const startModificator = () => {
    modificator = current;
    current = '';
  };
  // @replace-end

  // @replace-start
  const saveModificator = () => {
    modificator = modificator.trim();

    // @remove-start
    if (modificators[modificator]) {
      throw new Error(
        `(parse error) "${modificator}" duplicated definiton at one block`
      );
    }
    // @remove-end

    modificators[modificator] = parse(current, {
      parentType: 'modificator',
      name: modificator,
    });

    modificator = '';
  };
  // @replace-end

  // @replace-start
  const isInsideModificator = () => {
    return !!modificator;
  };
  // @replace-end

  // @replace-start
  const isRootComponentBlockStarts = symbol => {
    return symbol === '{' && isAllBracketsClosed();
  };
  // @replace-end

  // @replace-start
  const startComponent = () => {
    const parts = current.trim().split(' ');

    if (parts.length === 1) {
      component = parts[0];
    } else {
      styles += parts.slice(0, -1).join('');
      component = parts[parts.length - 1];
    }

    current = '';
  };
  // @replace-end

  // @replace-start
  const isInsideComponent = () => {
    return !!component;
  };
  // @replace-end

  // @replace-start
  const save = symbol => {
    current += symbol;
  };
  // @replace-end

  // @replace-start
  const saveComponent = () => {
    // @remove-start
    if (components[component]) {
      throw new Error(
        `(parse error) "${component}" duplicated definiton at one block`
      );
    }
    // @remove-end

    components[component] = parse(current, {
      parentType: 'component',
      name: component,
    });

    component = null;
    current = '';
  };
  // @replace-end

  // @replace-start
  const updateStylesTail = () => {
    if (current) {
      styles += current;
    }
  };
  // @replace-end

  // ---
  const mixins = [];
  let possibleMixin = false;
  let mixin = '';

  // @replace-start
  const isMixinStartSymbol = symbol => {
    return symbol === '_';
  };
  // @replace-end

  // @replace-start
  const isMixinEndSymbol = symbol => {
    return symbol === ' ';
  };
  // @replace-end

  // @replace-start
  const possibleMixinStart = () => {
    possibleMixin = true;
  };
  // @replace-end

  // @replace-start
  const possibleMixinEnd = () => {
    possibleMixin = false;
  };
  // @replace-end

  // @replace-start
  const isPossibleMixin = () => {
    return possibleMixin;
  };
  // @replace-end

  // @replace-start
  const saveMixinString = symbol => {
    mixin += symbol;
  };
  // @replace-end

  // @replace-start
  const clearMixin = () => {
    mixin = '';
  };
  // @replace-end

  // @replace-start
  const removeMixinFromStyles = () => {
    current = current.replace(mixin.trim(), '');
  };
  // @replace-end

  // @replace-start
  const saveMixin = () => {
    mixins.push(mixin.trim());
  };
  // @replace-end

  // @remove-start
  const isInValidMixinPosition = () => {
    return !parent ||
      (currentBackup.trim().length &&
        !new RegExp(`(;|{)\\s+?${mixin.trim()}`).test(`${current}`.trim()));
  };
  // @remove-end

  // ----

  for (let symbol of raw) {
    if (!isInsideComponent() && !isInsideModificator()) {
      if (isMixinStartSymbol(symbol)) {
        possibleMixinStart();
      }

      if (isPossibleMixin()) {
        saveMixinString(symbol);

        if (isMixinEndSymbol(symbol)) {
          possibleMixinEnd();
          // @remove-start
          if (isInValidMixinPosition()) {
            if (parent) {
              const nearestCode = `${currentBackup}${current}`
                .replace(/\s+/g, ' ')
                // .replace(mixin.trim(), '{{ MIXIN }}' + mixin)
                .trim();

              console.warn(
                'seems wrong mixin position',
                `${parent.name} - ${nearestCode}`
              );
            } else {
              console.warn(
                'seems wrong mixin position',
                `mixin should not be at root`
              );
            }
          }
          // @remove-end

          saveMixin();
          removeMixinFromStyles();
          clearMixin();
        }
      }
    }

    if (!isInsideComponent() && !isInsideModificator()) {
      if (!isPossibleModificator() && isModificatorStartSymbol(symbol)) {
        possibleModificatorStart();
        backup();
      }

      if (isPossibleModificator() && isModificatorEndSymbol(symbol)) {
        if (isModificator()) {
          startModificator();
        } else {
          restore();
        }

        possibleModificatorEnd();
      }
    }

    if (
      !isPossibleModificator() &&
      !isInsideModificator() &&
      isRootComponentBlockStarts(symbol)
    ) {
      openBracket();
      startComponent();

      // continue;
    } else if (symbol === '{') {
      if (isInsideComponent()) {
        openBracket();

        if (openedBrackets !== 1) {
          save(symbol);
        }
      } else if (isInsideModificator()) {
        openModificatorBracket();

        if (openedModificatorBrackets !== 1) {
          save(symbol);
        }
      }
    } else if (symbol === '}') {
      if (isInsideComponent()) {
        closeBracket();
      } else if (isInsideModificator()) {
        closeModificatorBracket();
      }

      if (isInsideComponent()) {
        if (isAllBracketsClosed()) {
          saveComponent();
        } else {
          save(symbol);
        }
      } else if (isInsideModificator()) {
        if (isAllModificatorBracketsClosed()) {
          saveModificator();
          clearAndRestore();
        } else {
          save(symbol);
        }
      }
    } else {
      save(symbol);
    }
  }

  restore();
  updateStylesTail();

  return {
    mixins,
    components,
    styles: parseCss(styles),
    modificators,
  };
};

export default inline => {
  return parse(inline.replace(/\r|\n/g, ''));
};
