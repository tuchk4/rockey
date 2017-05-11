export default function validateCSSrules(styles) {
  const experimental = document.createElement('div');

  Object.keys(styles).forEach(key => {
    experimental.style.setProperty(key, styles[key]);

    if (experimental.style[key] !== styles[key]) {
      console.warn(`Wrong rule: "${key}:${styles[key]}"`);
    }
  });

  return styles;
}
