import React from 'react';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';

import htmlTags from './htmlTags';

const ucfirst = s => s.charAt(0).toUpperCase() + s.slice(1);
let counter = {};

const assignShortcuts = rockey => {
  for (const tag of htmlTags) {
    // ---- tag hoc lazy creation
    Object.defineProperty(rockey, tag, {
      get: () =>
        (...args) => {
          // Use function component instaed of tag string
          // to support look feature - when add splited comopnent
          // as static props to constructor
          const TagComponent = props => {
            return React.createElement(tag, props);
          };

          if (args.length === 1 && isString(args[0])) {
            // ---- use with defined displayName
            return rockey(ucfirst(args[0]), TagComponent);
          } else if (isArray(args[0])) {
            // ---- use as anonymys tag shortcut
            if (!counter[tag]) {
              counter[tag] = 0;
            }

            return rockey(
              `Shortcut${ucfirst(tag)}${++counter[tag]}`,
              TagComponent
            )(...args);
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
