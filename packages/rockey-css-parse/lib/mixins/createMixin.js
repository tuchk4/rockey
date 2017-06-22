import memoize from 'lodash/memoize';

const createMixin = ({ className, selector, func, parse, plugins }) => {
  let counter = 0;
  const variations = {};

  const applyPlugins = styles => {
    if (plugins) {
      return plugins.reduce((styles, plugin) => plugin(styles), styles);
    }

    return styles;
  };

  const mixin = memoize(props => {
    const raw = func(props);

    if (!raw) {
      return {
        className: null,
        precss: null,
      };
    }

    const key = func.prop ? raw[func.prop] : raw;

    let variateClassName = variations[key];

    if (!variateClassName) {
      variateClassName = `${className}-${++counter}`;
      variations[key] = variateClassName;
    } else {
      return {
        className: variateClassName,
        precss: null,
      };
    }

    let mixinSelector = null;
    if (selector.length) {
      mixinSelector = selector.map(s => `.${variateClassName}${s}`);
    } else {
      mixinSelector = [`.${variateClassName}`];
    }

    let precss = null;

    if (func.prop) {
      precss = [
        {
          selector: mixinSelector,
          styles: applyPlugins(raw),
        },
      ];
    } else {
      const parsed = parse(`${mixinSelector} { ${raw} }`);

      precss = parsed.precss.map(p => ({
        selector: p.selector,
        styles: p.styles,
      }));
    }

    return {
      precss,
      className: variateClassName,
    };
  });

  mixin.updateSelector = update => {
    selector = update(selector);
  };

  return mixin;
};

export default createMixin;
