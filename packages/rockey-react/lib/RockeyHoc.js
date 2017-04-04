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
      css,
    } = {}
  ) => {
    const name = displayName || `AnonymysRockey${++anonymysRockeyCounter}`;
    let queuedMixins = null;

    const FlexibleRockeyHoc = (...args) => {
      const CALL_TYPE = getCallType(...args);

      switch (CALL_TYPE) {
        // ---- TODO: CALL DEFINE NAME
        case WAS_CALLED_AS_NAMED_EXTEND:
          const childComponentName = args[0];

          return RockeyHoc(BaseComponent, {
            displayName: childComponentName,
            // parentName: name,
            css,
          });

        // ---- TODO: CALL WITH DEFINED CSS
        case WAS_CALLED_AS_ANONYM_EXTEND:
          const componentCss = rule(...args);
          if (css) {
            componentCss.addParent(css);
          }

          if (queuedMixins) {
            componentCss.addMixins(queuedMixins);
          }

          if (!childCounter[parentName]) {
            childCounter[parentName] = 0;
          }

          const childName = parentName
            ? `Child${parentName}-${++childCounter[parentName]}`
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
          if (!css) {
            // NOTE: mb overdie argument is not good
            css = rule``;
            css.wrapWith(name);
          }

          const classList = css.getClassList(props);
          return React.createElement(BaseComponent, {
            ...props,
            className: classnames(classList[name], props.className),
          });

        default:
          throw new Error('Wrong component call');
      }
    };

    FlexibleRockeyHoc.displayName = `Rockey(${name})`;

    // TODO: check if css object available
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

    // TODO: create css object instead of queuedMixns
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
