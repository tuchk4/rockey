import isString from 'lodash/isString';
import isArray from 'lodash/isArray';

import htmlTags from './htmlTags';

const ucfirst = s => s.charAt(0).toUpperCase() + s.slice(1);
let counter = {};

const assignShortcuts = RockeyHoc => {
  for (const tag of htmlTags) {
    // ---- tag hoc lazy creation
    Object.defineProperty(RockeyHoc, tag, {
      get: () =>
        (...args) => {
          if (args.length === 1 && isString(args[0])) {
            // ---- use with defined displayName
            return RockeyHoc(tag, {
              displayName: ucfirst(args[0]),
            });
          } else if (isArray(args[0])) {
            // ---- use as anonymys tag shortcut
            if (!counter[tag]) {
              counter[tag] = 0;
            }

            return RockeyHoc(tag, {
              displayName: `Shortcut${ucfirst(tag)}${++counter[tag]}`,
            })(...args);
          } else {
            throw new Error(
              `shortcut.${tag} used as React Component but without defined styles. Use jsx syntax directly for such cases - "<${tag}>...</${tag}>"`
            );
          }
        },
      set: () => {
        throw new Error('Override default RockeyHoc shorcuts is disabled');
      },
    });
  }
};

export default assignShortcuts;
