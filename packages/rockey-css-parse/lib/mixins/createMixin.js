const createMixin = ({ className, selector, func, parse }) => {
  let counter = 0;
  const variations = {};

  const mixin = props => {
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

    // root.forEach(n => {
    //   const rootComponentClassName = getClassName(n);
    //
    //   selector.forEach(s => {
    //     mixinSelector.push(
    //       s.replace(
    //         rootComponentClassName,
    //         `.${variateClassName}${rootComponentClassName}`
    //       )
    //     );
    //   });
    // });

    let precss = null;

    if (func.prop) {
      precss = [
        {
          selector: mixinSelector,
          styles: raw,
        },
      ];
    } else {
      const parsed = parse(raw);

      precss = parsed.precss.map(p => {
        return {
          selector: p.frames ? p.selector : mixinSelector,
          styles: p.styles,
          frames: p.frames,
        };
      });
    }

    return {
      precss,
      className: variateClassName,
    };
  };

  mixin.updateSelector = update => {
    selector = update(selector);
  };

  return mixin;
};

export default createMixin;
