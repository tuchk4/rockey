export default function validateCSSrules(reporter = console.warn) {
  return styles => {
    const experimental = document.createElement('div');

    Object.keys(styles).forEach(prop => {
      let value = styles[prop];
      const isImportant = value.indexOf('!important') !== -1;

      value = isImportant ? value.replace('!important', '').trim() : value;

      experimental.style.setProperty(prop, value);

      if (!experimental.style[prop]) {
        reporter(
          `rockey (validateCSSRule) wrong rule "${prop}:${styles[prop]}"`
        );
      }
    });

    return styles;
  };
}
