import React from 'react';
import classnames from 'classnames';

import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';

import rule from 'rockey/rule';
import look from './look';

const WAS_CALLED_AS_ANONYM_EXTEND = 'WAS_CALLED_AS_ANONYM_EXTEND';
const WAS_CALLED_AS_NAMED_EXTEND = 'WAS_CALLED_AS_NAMED_EXTEND';
const WAS_CALLED_AS_REACT_COMPONENT = 'WAS_CALLED_AS_REACT_COMPONENT';

const getCallType = (...args) => {
  if (args.length === 1 && isString(args[0])) {
    return WAS_CALLED_AS_NAMED_EXTEND;
  } else if (isArray(args[0]) || (isObject(args[0]) && args.length === 1)) {
    return WAS_CALLED_AS_ANONYM_EXTEND;
  } else {
    return WAS_CALLED_AS_REACT_COMPONENT;
  }
};

let anonymysRockeyCounter = 0;
const childCounter = {};

export const getRockeyHoc = () => {
  const RockeyHoc = (
    BaseComponent,
    {
      displayName,
      parentName,
      // mixins,
      css,
    } = {}
  ) => {
    const name = displayName || `AnonymysRockey${++anonymysRockeyCounter}`;
    let queuedMixins = null;

    const FlexibleRockeyHoc = (...args) => {
      const CALL_TYPE = getCallType(...args);

      switch (CALL_TYPE) {
        // ----
        case WAS_CALLED_AS_NAMED_EXTEND:
          const childComponentName = args[0];

          return (...args) => {
            return RockeyHoc(BaseComponent, {
              displayName: childComponentName,
              css,
            })(...args);
          };

        // ----
        case WAS_CALLED_AS_ANONYM_EXTEND:
          const componentCss = rule(...args);
          if (css) {
            componentCss.addParent(css);
          }

          if (queuedMixins) {
            componentCss.addMixins(queuedMixins);
          }

          if (!childCounter[name]) {
            childCounter[name] = 0;
          }

          const childName = parentName
            ? `Child${name}-${++childCounter[name]}`
            : name;

          componentCss.wrapWith(childName);

          return RockeyHoc(BaseComponent, {
            displayName: childName,
            parentName: name,
            css: componentCss,
          });

        // ----
        case WAS_CALLED_AS_REACT_COMPONENT:
          const props = args[0];
          const classList = css ? css.getClassList(props) : {};
          return React.createElement(BaseComponent, {
            ...props,
            className: classnames(classList[name], props.className),
          });

        default:
          throw new Error('Wrong component call');
      }
    };

    FlexibleRockeyHoc.displayName = `Rockey(${name})`;

    FlexibleRockeyHoc.extends = (displayName, childCss) => {
      childCss.addParent(css);

      return RockeyHoc(BaseComponent, {
        displayName: displayName,
        parentName: name,
        css: childCss,
      });
    };

    FlexibleRockeyHoc.look = (...args) => {
      const component = RockeyHoc(BaseComponent, {
        displayName,
        parentName,
        css,
      });

      return look(component, {
        extendBase: false,
      })(...args);
    };

    FlexibleRockeyHoc.addMixins = mixins => {
      if (css) {
        css.addMixins(mixins);
      } else {
        queuedMixins = mixins;
      }
    };

    return FlexibleRockeyHoc;
  };

  return RockeyHoc;
};

const RockeyHoc = getRockeyHoc();
export default RockeyHoc;
