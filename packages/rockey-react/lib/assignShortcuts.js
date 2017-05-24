import React from 'react';
import 'react-dom';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';

import htmlTags from './htmlTags';

const ucfirst = s => s.charAt(0).toUpperCase() + s.slice(1);
let counter = {};

const assignShortcuts = rockey => {
  for (const tag of htmlTags) {
    // ---- tag hoc lazy creation
    Object.defineProperty(rockey, tag, {
      get: () => (...args) => {
        if (args.length === 1 && isString(args[0])) {
          // ---- use with defined displayName
          return rockey(ucfirst(args[0]), tag);
        } else if (isArray(args[0])) {
          // ---- use as anonymys tag shortcut
          if (!counter[tag]) {
            counter[tag] = 0;
          }

          return rockey(`Shortcut${ucfirst(tag)}${++counter[tag]}`, tag)(
            ...args
          );
        } else {
          return React.createElement(tag, filterProps(args[0]));
          // throw new Error(
          //   `shortcut.${tag} used as React Component but without defined styles. Use jsx syntax directly for such cases - "<${tag}>...</${tag}>"`
          // );
        }
      },
      set: () => {
        throw new Error('Override default RockeyHoc shorcuts is disabled');
      },
    });
  }
};

export default assignShortcuts;
