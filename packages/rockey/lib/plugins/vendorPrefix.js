import * as vendor from 'css-vendor';

export default function vendorPrefix(reporter = console.warn) {
  return styles => {
    let deletions = [];

    Object.keys(styles).forEach(prop => {
      const supportedProp = vendor.supportedProperty(prop);

      const value = styles[prop].toString();
      const isImportant = value.indexOf('!important') !== -1;
      const supportedValue = vendor.supportedValue(
        supportedProp,
        isImportant
          ? styles[prop].replace('!important', '').trim()
          : styles[prop]
      );

      if (supportedValue && supportedProp) {
        if (supportedProp !== prop) {
          deletions.push(prop);
        }

        styles[supportedProp] =
          supportedValue + (isImportant ? ' !important' : '');
      } else {
        deletions.push(prop);
        reporter(
          `rockey (vendorPrefix) rule "${prop}:${styles[prop]}" is not supported`
        );
      }
    });

    if (deletions.length) {
      deletions.forEach(key => {
        delete styles[key];
      });
    }

    return styles;
  };
}
