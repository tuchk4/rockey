import * as vendor from 'css-vendor';

export default function vendorPrefix(styles) {
  let deletions = [];

  Object.keys(styles).forEach(prop => {
    const supportedProp = vendor.supportedProperty(prop);
    const supportedValue = vendor.supportedValue(supportedProp, styles[prop]);

    if (supportedProp !== prop) {
      deletions.push(prop);
    }

    styles[supportedProp] = supportedValue;
  });

  deletions.forEach(key => {
    delete styles[key];
  });

  return styles;
}
