export const stringifyRule = (className, description) => {
  return `
    ${className} {
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
  }
  `;
};

export const stringify = ({ selector, styles, frames, media }) => {
  let css = '';

  if (styles) {
    if (media) {
      css = `
        ${media} {
          ${stringifyRule(selector, styles)}
        }
      `;
    } else {
      css = stringifyRule(selector, styles);
    }
  } else if (frames) {
    if (media) {
      css = `
        ${media} {
          ${selector} {
            ${frames.map(stringify).join(' ')}
          }
        }
      `;
    } else {
      css = `${selector} {
        ${frames.map(stringify).join(' ')}
      }`;
    }
  }

  return css;
};

export const stringifyRules = precss => {
  let css = '';

  precss.forEach(p => {
    css += stringify(p);
  });

  return css;
};
