import React from 'react';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import compose from 'recompose/compose';

import filterProps from './utils/filterProps';
import htmlTags from './htmlTags';
import rockey from './';

const ucfirst = s => s.charAt(0).toUpperCase() + s.slice(1);

let anonCounter = 0;

const RecomposeRockeyHoc = (...args) => {
  let displayName = null;
  let BaseComponent = null;

  // TODO: check types
  if (args.length === 1) {
    displayName = `RockeyRecompose${++anonCounter}`;
    BaseComponent = args[0];
  } else {
    displayName = args[0];
    BaseComponent = args[1];
  }

  return (...enhancers) => {
    const RecomposeHoc = compose(...enhancers)(BaseComponent);

    return rockey(ucfirst(displayName), RecomposeHoc);
  };
};

let counter = {};

for (const tag of htmlTags) {
  // ---- tag hoc lazy creation
  Object.defineProperty(RecomposeRockeyHoc, tag, {
    get: () => (displayName, ...args) => {
      let name = null;
      let enhancers = null;

      if (isString(displayName)) {
        name = ucfirst(displayName);
        enhancers = args;
      } else if (isFunction(displayName)) {
        if (!counter[tag]) {
          counter[tag] = 0;
        }

        name = `RecomposeShortcut${ucfirst(tag)}${++counter[tag]}`;
        enhancers = [displayName, ...args];
      } else {
        throw new Error(`wrong usage`);
      }

      const TagComponent = props => {
        return React.createElement(tag, filterProps(props));
      };

      return RecomposeRockeyHoc(name, TagComponent)(...enhancers);
    },
    set: () => {
      throw new Error('Override default RockeyHoc shorcuts is disabled');
    },
  });
}

export default RecomposeRockeyHoc;
