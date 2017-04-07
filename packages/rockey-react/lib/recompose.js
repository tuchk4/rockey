import React from 'react';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';

import compose from 'recompose/compose';
import setDisplayName from 'recompose/setDisplayName';

import { getRockeyHoc } from './RockeyHoc';
import htmlTags from './htmlTags';

const ucfirst = s => s.charAt(0).toUpperCase() + s.slice(1);

const RockeyHoc = getRockeyHoc();

const RecomposeRockeyHoc = (displayName, BaseComponent) =>
  (...enhacners) => {
    const RecomposeHoc = compose(
      setDisplayName(ucfirst(displayName)),
      ...enhacners
    )(BaseComponent);

    return RockeyHoc(RecomposeHoc, {
      displayName: ucfirst(displayName),
    });
  };

let counter = {};

for (const tag of htmlTags) {
  // ---- tag hoc lazy creation
  Object.defineProperty(RecomposeRockeyHoc, tag, {
    get: () =>
      (displayName, ...enhacners) => {
        // Use function component instaed of tag string
        // to support look feature - when add splited comopnent
        // as static props to constructor
        const TagComponent = props => {
          return React.createElement(tag, props);
        };

        if (isString(displayName)) {
          return RecomposeRockeyHoc(ucfirst(displayName), TagComponent)(
            ...enhacners
          );
        } else if (isFunction(displayName)) {
          if (!counter[tag]) {
            counter[tag] = 0;
          }

          return RecomposeRockeyHoc(
            `RecomposeShortcut${ucfirst(tag)}${++counter[tag]}`,
            TagComponent
          )(...[displayName, ...enhacners]);
        } else {
          throw new Error(`wrong usage`);
        }
      },
    set: () => {
      throw new Error('Override default RockeyHoc shorcuts is disabled');
    },
  });
}

export default RecomposeRockeyHoc;
