export function renderRule(className, description) {
  return `${className} {
  ${Object.keys(description)
    .map(key => {
      // support fallback rules
      if (Array.isArray(description[key])) {
        return description[key].map(value => `${key}:${value};`).join('');
      } else {
        return `${key}:${description[key]};`;
      }
    })
    .join('')}
}`;
}

export function render({ selector, styles, frames, media, type }) {
  let css = '';

  if (styles) {
    if (media) {
      css = `${media} {
  ${renderRule(selector, styles)}
}
`;
    } else {
      css = renderRule(selector, styles);
    }
  } else if (frames) {
    if (media) {
      css = `${media} {
  ${selector} {
    ${frames.map(stringify).join(' ')}
  }
}
`;
    } else {
      css = `${selector} {
  ${frames.map(stringify).join(' ')}
}
`;
    }
  }

  return css;
}

export function renderRules(precss) {
  let css = '';

  precss.forEach(p => {
    css += render(p);
  });

  return css;
}

export function stringify(precss, props) {
  let css = '';

  if (Array.isArray(precss)) {
    precss.forEach(p => {
      css += render(p);
    });

    if (props) {
      precss.forEach(p => {
        if (p.mixins) {
          p.mixins.forEach(mixin => {
            const { precss } = mixin(props);
            if (precss) {
              css += renderRules(precss);
            }
          });
        }

        // if (p.frames) {
        //   p.frames.forEach(f => {
        //     f.mixins.forEach(mixin => {
        //       const { precss } = mixin(props);
        //       if (precss) {
        //         css += renderRules(precss);
        //       }
        //     });
        //   });
        // }
      });
    }
  } else {
    css = render(precss);

    if (props && precss.mixins) {
      precss.mixins.forEach(mixin => {
        const { precss } = mixin(props);
        if (precss) {
          css += renderRules(precss);
        }
      });
    }
  }

  return css;
}

export default stringify;
