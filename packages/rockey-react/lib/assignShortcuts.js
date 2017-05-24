import React from 'react';
import 'react-dom';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';

import createElement from './utils/createElement';
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
          return createElement(tag, args[0]);
        }
      },
      set: () => {
        throw new Error('Override default RockeyHoc shorcuts is disabled');
      },
    });
  }
};

export default assignShortcuts;
