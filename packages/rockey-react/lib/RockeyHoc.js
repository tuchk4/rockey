import React from 'react';
import isString from 'lodash/isString';
import classnames from 'classnames';

import rule from 'rockey/rule';

const WAS_CALLED_AS_CSS = 'WAS_CALLED_AS_CSS';
const WAS_CALLED_AS_CSS_EXTENDS = 'WAS_CALLED_AS_CSS_EXTENDS';
const WAS_CALLED_AS_REACT_COMPONENT = 'WAS_CALLED_AS_REACT_COMPONENT';

const getCallType = (...args) => {
  if (args.length === 1 && isString(args[0])) {
    return WAS_CALLED_AS_CSS_EXTENDS;
  } else if (Array.isArray(args[0])) {
    return WAS_CALLED_AS_CSS;
  } else {
    return WAS_CALLED_AS_REACT_COMPONENT;
  }
};

const renderReactComopnent = (
  BaseComponent,
  {
    props,
    css,
    displayName,
  }
) => {
  const classList = css ? css.getClassList(props) : {};

  return React.createElement(BaseComponent, {
    ...props,
    className: classnames(classList[displayName], props.className),
  });
};

let anonymysRockeyCounter = 0;

const uniq = new Map();
const getUniqKey = (BaseComponent, strings, values) => {
  return JSON.stringify([
    BaseComponent.toString(),
    ...strings,
    ...(values || []),
  ]);
};

export const getRockeyHoc = () => {
  const CreateRockeyHoc = (
    BaseComponent,
    {
      displayName,
      parentCss = null,
    } = {}
  ) => {
    if (isString(BaseComponent)) {
      displayName = displayName || BaseComponent;
    } else if (!parentCss) {
      displayName = displayName ||
        BaseComponent.displayName ||
        `AnonymysRockey${++anonymysRockeyCounter}`;
    } else {
      displayName = displayName || `AnonymysRockey${++anonymysRockeyCounter}`;
    }

    return (...args) => {
      const CALL_TYPE = getCallType(...args);

      if (CALL_TYPE === WAS_CALLED_AS_REACT_COMPONENT) {
        return renderReactComopnent(BaseComponent, {
          props: args[0],
          displayName,
          css: parentCss,
        });
      }

      const css = rule(...args);

      if (parentCss) {
        css.addParent(parentCss);
      }

      css.wrapWith(displayName);

      const RockeyHoc = function RockeyHoc(...args) {
        const CALL_TYPE = getCallType(...args);

        switch (CALL_TYPE) {
          case WAS_CALLED_AS_CSS_EXTENDS:
            return (childStrings, ...childValues) => {
              const childCss = rule(childStrings, ...childValues);

              return CreateRockeyHoc(BaseComponent, {
                displayName: args[0],
                parentCss: css,
              })(childStrings, ...childValues);
            };

          case WAS_CALLED_AS_CSS:
            return CreateRockeyHoc(BaseComponent, {
              displayName: 'Child' + displayName,
              parentCss: css,
            })(args[0], ...args.slice(1));

          case WAS_CALLED_AS_REACT_COMPONENT:
            return renderReactComopnent(BaseComponent, {
              props: args[0],
              displayName,
              css,
            });

          default:
            throw new Error('Wrong component call');
        }
      };

      RockeyHoc.displayName = `Rockey(${displayName})`;

      return RockeyHoc;
    };
  };

  return CreateRockeyHoc;
};

const RockeyHoc = getRockeyHoc();
export default RockeyHoc;
