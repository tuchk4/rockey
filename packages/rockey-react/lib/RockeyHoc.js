import React from 'react';
import classnames from 'classnames';

import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';

import rule from 'rockey/rule';
import look from './look';

import RockeyHocWithHandlers from './utils/RockeyHocWithHandlers';
import { ROCKEY_MIXIN_HANDLER_KEY } from './handler';

const COMPONENT_EXTENDS = 'COMPONENT_EXTENDS';
const DEFINE_COMPONENT_NAME = 'DEFINE_COMPONENT_NAME';
const WAS_CALLED_AS_REACT_COMPONENT = 'WAS_CALLED_AS_REACT_COMPONENT';

const getCallType = (...args) => {
  if (args.length === 1 && isString(args[0])) {
    return DEFINE_COMPONENT_NAME;
  } else if (isArray(args[0]) || (isObject(args[0]) && args.length === 1)) {
    return COMPONENT_EXTENDS;
  } else {
    return WAS_CALLED_AS_REACT_COMPONENT;
  }
};

let anonymysRockeyCounter = 0;
const childCounter = {};

const createEmtpyCss = name => {
  const css = rule``;
  css.wrapWith(name);
  return css;
};

export const getRockeyHoc = () => {
  const RockeyHoc = (
    BaseComponent,
    {
      displayName,
      parentName,
      css,
      at,
    } = {}
  ) => {
    const name = displayName || `AnonymysRockey${++anonymysRockeyCounter}`;
    let queuedMixins = null;

    const FlexibleRockeyHoc = (...args) => {
      const CALL_TYPE = getCallType(...args);

      switch (CALL_TYPE) {
        case DEFINE_COMPONENT_NAME:
          const childComponentName = args[0];

          return RockeyHoc(BaseComponent, {
            displayName: childComponentName,
            parentName: name,
            css,
            at: DEFINE_COMPONENT_NAME,
          });

        case COMPONENT_EXTENDS:
          const componentCss = rule(...args);

          if (queuedMixins) {
            componentCss.addMixins(queuedMixins);
          }

          if (css) {
            componentCss.addParent(css);
          }

          // TODO: ?
          let childName = null;

          if (parentName && at !== DEFINE_COMPONENT_NAME) {
            if (!childCounter[parentName]) {
              childCounter[parentName] = 0;
            }

            childName = `Child${parentName}-${++childCounter[parentName]}`;
          } else {
            childName = name;
          }

          componentCss.wrapWith(childName);

          return RockeyHoc(BaseComponent, {
            displayName: childName,
            parentName: name,
            css: componentCss,
            at: COMPONENT_EXTENDS,
          });

        case WAS_CALLED_AS_REACT_COMPONENT:
          const props = args[0];

          if (!css) {
            css = createEmtpyCss(name);
          }

          let selector = name;

          if (at === DEFINE_COMPONENT_NAME) {
            selector = parentName;
          }

          const handlers = [];
          Object.keys(css.mixins).forEach(key => {
            const mixin = css.mixins[key];

            if (mixin[ROCKEY_MIXIN_HANDLER_KEY]) {
              handlers.push(mixin);
            }
          });

          if (handlers.length) {
            return (
              <RockeyHocWithHandlers
                css={css}
                selector={selector}
                handlers={handlers}
                BaseComponent={BaseComponent}
                proxy={props}
              />
            );
          } else {
            const classList = css.getClassList(props);
            const className = classnames(classList[selector], props.className);

            return React.createElement(BaseComponent, {
              ...props,
              className,
            });
          }

        default:
          throw new Error('Wrong component call');
      }
    };

    FlexibleRockeyHoc.displayName = `Rockey(${name})`;

    FlexibleRockeyHoc.extends = (displayName, childCss) => {
      if (!css) {
        css = createEmtpyCss(name);
      }

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
