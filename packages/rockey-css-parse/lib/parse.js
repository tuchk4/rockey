import cssToJSON from './cssToJSON';
import createMixin from './mixins/createMixin';
import interpolateWithMixins from './mixins/interpolateWithMixins';
import * as classnames from './utils/classnames';

const isMedia = key => key.indexOf('@media') === 0;
const isKeyFrames = key => key.indexOf('@keyframes') === 0;
const isNot = key => key.indexOf(':not') === 0;
const NOT_REGEX = /\(([^\)]+)\)(.*)/;

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

export default function createParser(config = {}) {
  const plugins = config.plugins || [];

  const actions = {
    // getClassName: classnames.getClassName(config.getClassName),
    getMixinClassName: classnames.getMixinClassName(config.getMixinClassName),
    // getSelector: classnames.getSelector(config.getClassName),
    getAnimationName: config.getAnimationName
      ? config.getAnimationName
      : name => name,
  };

  const getComponentName = classnames.getComponentName;

  return function parse(strings, ...values) {
    const context = {
      hasAnimations: false,
      animations: {},
      classnames: {
        components: {},
        selector: {},
      },
    };

    const classname = classnames.getClassName(config.getClassName);
    const getClassName = component => {
      if (context.classnames.components[component]) {
        return context.classnames.components[component];
      }
      const className = classname(component);
      context.classnames.components[component] = className;

      return className;
    };

    const selector = classnames.getSelector(getClassName);
    const getSelector = component => {
      if (context.classnames.selector[component]) {
        return context.classnames.selector[component];
      }
      const className = selector(component);
      context.classnames.selector[component] = className;

      return className;
    };

    let precss = [];

    let raw = null;
    let mixinsFunctions = {};

    if (values.length === 0) {
      raw = Array.isArray(strings) ? strings[0] : strings;
    } else {
      const interpolated = interpolateWithMixins(strings, ...values);
      raw = interpolated.raw;
      mixinsFunctions = interpolated.mixinsFunctions;
    }

    const inline = raw.replace(/\r|\n/g, '').replace(/\s+/g, ' ');

    const root = toPreCSS(inline, {
      type: 'root',
      selector: [],
      media: null,
      root: [],
    });

    return {
      classList: root.reduce((components, c) => {
        components[getComponentName(c)] = getClassName(c);
        return components;
      }, {}),
      precss,
    };

    function toPreCSS(raw, parent = {}) {
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
      const correctModificatorPosition = () => {
        return (s => !s.length || s.slice(-1) === ';' || s.slice(-1) === '{')(
          current.trim()
        );
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

              if (parent.selector.length) {
                parent.selector.forEach(s => {
                  selector.push(s + m);
                });
              } else {
                selector.push(m);
              }
            });
          }
        }

        if (keyframes) {
          let animationName = modificator.split(' ')[1];

          let uniqAnimationName = actions.getAnimationName(animationName);

          context.hasAnimations = true;
          context.animations[animationName] = uniqAnimationName;

          const backup = precss;
          precss = [];

          toPreCSS(current, {
            type: 'keyframes',
            root: parent.root,
          });

          backup.push({
            media: media ? modificator : parent.media,
            selector: modificator.replace(animationName, uniqAnimationName),
            frames: precss,
          });

          precss = backup;
        } else {
          toPreCSS(current, {
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
        let i = null;
        for (i = current.length; i > 0; i--) {
          const symbol = current[i];
          if (symbol === ';') {
            i++;
            break;
          }
        }

        let currentComponents = [];

        if (i) {
          styles += current.slice(0, i);
          currentComponents = current.slice(i).split(',');
        } else {
          currentComponents = current.split(',');
        }

        currentComponents.forEach(c => {
          components.push(c.trim());
        });

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
            rootComponents.push(c);

            const className = getSelector(c);

            if (parent.selector.length) {
              parent.selector.forEach(p => {
                selector.push(`${p} ${className}`);
              });
            } else {
              selector.push(className);
            }
          });
        }

        toPreCSS(current, {
          type: 'component',
          media: parent.media,
          root: parent.root.length ? parent.root : components,
          selector: parent.type === 'keyframes' ? components : selector,
        });

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
        return symbol === ';' || symbol === ' ';
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
        const mixinFunction = createMixin({
          className: actions.getMixinClassName(mixinsFunctions[mixin]),
          selector: parent.selector,
          root: parent.root,
          func: mixinsFunctions[mixin],
          parse,
        });

        mixins.push(mixinFunction);
      };
      // @replace-end
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

          if (
            !isPossibleModificator() &&
            isModificatorStartSymbol(symbol) &&
            correctModificatorPosition()
          ) {
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

      if (styles || mixins.length) {
        precss.push({
          selector: parent.selector,
          media: parent.media,
          root: parent.root,
          styles: styles ? cssToJSON(styles, context, plugins) : {},
          mixins,
        });
      }

      return rootComponents;
    }
  };
}
