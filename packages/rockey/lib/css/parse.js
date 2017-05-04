import getClassName, {
  getSelector,
  getComponentName,
  generateAnimationName,
} from './getClassName';

// const validateRule = (rule, value) => {};
// const autoprefixRule = (rule, value) => {};

const cache = new Map();

const isMedia = key => key.indexOf('@media') === 0;
const isKeyFrames = key => key.indexOf('@keyframes') === 0;
const isNot = key => key.indexOf(':not') === 0;
const NOT_REGEX = /\(([^\)]+)\)(.*)/;

let PARSE_RUNTIME_CONTEXT = {};

const resetContext = () => {
  PARSE_RUNTIME_CONTEXT = {
    animations: {},
  };
};

resetContext();

const parseCss = styles => {
  const stylesParts = styles
    .trim()
    .split(';')
    .map(s => (s ? s.split(':') : null))
    .filter(s => !!s);

  const key = stylesParts.toString();

  if (!key.trim()) {
    return {};
  }

  if (cache.has(key)) {
    return cache.get(key);
  }

  const stylesJson = stylesParts.reduce((json, raw) => {
    if (raw) {
      let rule = raw[0].trim();
      let value = raw[1].trim();

      if (
        PARSE_RUNTIME_CONTEXT.hasAnimations &&
        (rule === 'animation' || rule === 'animationName')
      ) {
        let animationName = null;

        if (rule === 'animation') {
          animationName = value.split(' ')[0];
        } else if (rule === 'animation-name') {
          animationName = value;
        }

        if (animationName !== 'none') {
          const uniqAnimationName =
            PARSE_RUNTIME_CONTEXT.animations[animationName];
          value = value.replace(animationName, uniqAnimationName);
        }
        // TODO: log warning if not uniq animation name
      }

      if (rule && value) {
        if (json[rule]) {
          // css fallback values
          let prev = Array.isArray(json[rule]) ? json[rule] : [json[rule]];

          json[rule] = prev.concat(value);
        } else {
          json[rule] = value;
        }
      }
      // TODO: log warning if there are no rule on value

      // validateRule(value[0], json[value[0]]);
      // json[value[0].trim()] = autoprefixRule(value.slice(1).join(':').trim());
    }
    return json;
  }, {});

  cache.set(key, stylesJson);

  return stylesJson;
};

// @replace-start
const isModificatorStartSymbol = symbol => {
  return symbol === '@' || symbol === ':' || symbol === '[';
};
// @replace-end

// @replace-start
const isModificatorEndSymbol = symbol => {
  return symbol === '{' || symbol === ';';
};
// @replace-end

// TODO: make this func beauty :)
const isStartsWithModificator = raw => {
  return (
    0 === raw.indexOf('@media') ||
    0 === raw.indexOf('[') ||
    0 === raw.indexOf('@keyframes') ||
    0 === raw.indexOf('::placeholder') ||
    0 === raw.indexOf('::after') ||
    0 === raw.indexOf('::before') ||
    0 === raw.indexOf('::first-letter') ||
    0 === raw.indexOf('::first-line') ||
    0 === raw.indexOf(':active') ||
    0 === raw.indexOf(':checked') ||
    0 === raw.indexOf(':disabled') ||
    0 === raw.indexOf(':empty') ||
    0 === raw.indexOf(':enabled') ||
    0 === raw.indexOf(':first-child') ||
    0 === raw.indexOf(':first-of-type') ||
    0 === raw.indexOf(':focus') ||
    0 === raw.indexOf(':hover') ||
    0 === raw.indexOf(':in-range') ||
    0 === raw.indexOf(':invalid') ||
    0 === raw.indexOf(':lang') ||
    0 === raw.indexOf(':last-child') ||
    0 === raw.indexOf(':last-of-type') ||
    0 === raw.indexOf(':link') ||
    0 === raw.indexOf(':not') ||
    0 === raw.indexOf(':nth-child') ||
    0 === raw.indexOf(':nth-last-child') ||
    0 === raw.indexOf(':nth-last-of-type') ||
    0 === raw.indexOf(':nth-of-type') ||
    0 === raw.indexOf(':only-of-type') ||
    0 === raw.indexOf(':only-child') ||
    0 === raw.indexOf(':optional') ||
    0 === raw.indexOf(':out-of-range') ||
    0 === raw.indexOf(':read-only') ||
    0 === raw.indexOf(':read-write') ||
    0 === raw.indexOf(':required') ||
    0 === raw.indexOf(':root') ||
    0 === raw.indexOf(':target') ||
    0 === raw.indexOf(':valid') ||
    0 === raw.indexOf(':visited')
  );
};

const shouldGenerateSelectors = parent => parent.type !== 'keyframes';

const parse = (raw, json, parent) => {
  let openedBrackets = 0;
  let openedModificatorBrackets = 0;
  let styles = '';

  let rootComponents = [];
  let components = [];

  let possibleModificator = 0;
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

    let selector = [];
    const media = isMedia(modificator);
    const keyframes = isKeyFrames(modificator);

    if (shouldGenerateSelectors(parent)) {
      if (media || keyframes) {
        selector = [...parent.selector];
      } else {
        modificator.split(',').forEach(m => {
          m = m.trim();

          if (isNot(m)) {
            const matches = m.match(NOT_REGEX);
            m = `:not(${getSelector(matches[1])})${matches[2]}`;
          }

          parent.selector.forEach(s => {
            selector.push(s + m);
          });
        });
      }
    }

    if (keyframes) {
      const frames = [];

      let animationName = modificator.split(' ')[1];

      let uniqAnimationName = generateAnimationName(animationName);

      PARSE_RUNTIME_CONTEXT.hasAnimations = true;
      PARSE_RUNTIME_CONTEXT.animations[animationName] = uniqAnimationName;

      parse(current, frames, {
        type: 'keyframes',
      });

      json.push({
        media: media ? modificator : parent.media,
        selector: modificator.replace(animationName, uniqAnimationName),
        frames,
      });
    } else {
      parse(current, json, {
        type: 'modificator',
        media: media ? modificator : parent.media,
        selector,
        root: parent.root,
      });
    }

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
    let parts = current.trim().split(' ');
    if (parts.length === 1) {
      components.push(parts[0]);
    } else {
      let i = 0;
      for (i = parts.length - 1; i >= 0; i--) {
        const part = parts[i];
        const charCode = part.charCodeAt(0);

        /* All chars starts with uppercase or xxx% for animations  */
        if (
          (charCode >= 65 && charCode <= 90) ||
          part[part.length - 1] === '%'
        ) {
          components.push(part.replace(',', '').trim());
        } else if (part[0] === '~' || part[0] === '+') {
          let size = components.length;
          components[size - 1] = part[0] + components[size - 1];
        } else {
          break;
        }
      }

      if (components.length) {
        parts = parts.slice(0, i + 1);
      } else {
        parts = parts.slice(0, -1);
      }

      styles += parts.join(' ');
    }

    current = '';
  };
  // @replace-end

  // @replace-start
  const isInsideComponent = () => {
    return !!components.length;
  };
  // @replace-end

  // @replace-start
  const save = symbol => {
    current += symbol;
  };
  // @replace-end

  // @replace-start
  const saveComponent = () => {
    const selector = [];

    if (shouldGenerateSelectors(parent)) {
      components.forEach(c => {
        if (parent.selector.length) {
          const className = getSelector(c);
          selector.push(parent.selector[0] + ' ' + className);
        } else {
          const className = getSelector(c);
          selector.push(className);
        }
      });
    }

    parse(current, json, {
      type: 'component',
      media: parent.media,
      root: parent.root ? parent.root : components,
      selector: parent.type === 'keyframes' ? components : selector,
    });

    rootComponents = rootComponents.concat(components);
    components = [];
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
    return symbol === ' ' || symbol === ';';
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
    current = current.replace(mixin, '');
  };
  // @replace-end

  // @replace-start
  const saveMixin = () => {
    mixins.push({
      id: mixin,
      forComponents: parent.root,
    });
  };
  // @replace-end

  // ----

  let size = raw.length;
  for (let i = 0; i < size; i++) {
    const symbol = raw[i];

    if (!isInsideComponent() && !isInsideModificator()) {
      if (isMixinStartSymbol(symbol)) {
        possibleMixinStart();
      }

      if (isPossibleMixin()) {
        if (isMixinEndSymbol(symbol)) {
          possibleMixinEnd();
          saveMixin();
          removeMixinFromStyles();
          clearMixin();

          continue;
        } else {
          saveMixinString(symbol);
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

  styles = styles.trim();

  if (styles) {
    json.push({
      selector: parent.selector,
      media: parent.media,
      styles: parseCss(styles),
      nodes: parent.nodes,
      root: parent.root,
      mixins,
    });
  }

  return rootComponents;
};

export default inline => {
  const precss = [];

  const root = parse(
    inline.replace(/\r|\n/g, '').replace(/\s+/g, ' '),
    precss,
    {
      type: 'root',
      selector: [],
    }
  );

  resetContext();

  return {
    classList: root.reduce((components, c) => {
      components[getComponentName(c)] = getClassName(c).slice(1); // remove dot "."
      return components;
    }, {}),
    precss,
  };
};
