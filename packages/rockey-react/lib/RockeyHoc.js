import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

import isString from 'lodash/isString';
import isArray from 'lodash/isArray';

import rule from 'rockey/rule';
import look from './look';

import createElement from './utils/createElement';

import { ROCKEY_MIXIN_HANDLER_KEY } from './handler';

import { CONTEXT_KEY } from './RockeyThemeProvider';
import RockeyComponent from './RockeyComponent';

const COMPONENT_EXTENDS = 'COMPONENT_EXTENDS';
const DEFINE_COMPONENT_NAME = 'DEFINE_COMPONENT_NAME';
const WAS_CALLED_AS_REACT_COMPONENT = 'WAS_CALLED_AS_REACT_COMPONENT';

const getCallType = (...args) => {
  if (args.length === 1 && isString(args[0])) {
    return DEFINE_COMPONENT_NAME;
  } else if (isArray(args[0])) {
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
    { displayName, parentName, css, at } = {}
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
          let { innerRef, ...props } = args[0];
          props.ref = innerRef;

          if (!css) {
            css = createEmtpyCss(name);
          }

          let rockeyCSSRule = null;
          if (at === DEFINE_COMPONENT_NAME) {
            // wrap with name because Function is used as React comopnent
            // but currect css object === parentCss. line :60
            rockeyCSSRule = createEmtpyCss(name);
            finshCssRule.addParent(css);
          } else {
            rockeyCSSRule = css;
          }

          // collect handler mixins
          const handlers = [];
          // TODO: remove this condition. mixins alwasy should be array
          if (rockeyCSSRule.mixins) {
            Object.keys(rockeyCSSRule.mixins).forEach(key => {
              const mixin = rockeyCSSRule.mixins[key];

              if (mixin[ROCKEY_MIXIN_HANDLER_KEY]) {
                handlers.push(mixin);
              }
            });
          }

          if (handlers.length) {
            return (
              <RockeyComponent
                rockeyCSSRule={rockeyCSSRule}
                selector={name}
                handlers={handlers}
                Component={BaseComponent}
                componentProps={props}
              />
            );
          } else {
            return (
              <RockeyComponent
                rockeyCSSRule={rockeyCSSRule}
                selector={name}
                Component={BaseComponent}
                componentProps={props}
              />
            );
          }

        default:
          throw new Error('Wrong component call');
      }
    };

    // FlexibleRockeyHoc.displayName = `Rockey(${name})`;
    FlexibleRockeyHoc.displayName = name;

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

      const childComponents = look(component, {
        extendBase: false,
      })(...args);

      Object.keys(childComponents).forEach(key => {
        FlexibleRockeyHoc[key] = childComponents[key];
      });

      return childComponents;
    };

    // TODO: create css object instead of queuedMixns
    FlexibleRockeyHoc.addMixins = mixins => {
      if (css) {
        css.addMixins(mixins);
      } else {
        queuedMixins = mixins;
      }
    };

    FlexibleRockeyHoc.propTypes = BaseComponent.propTypes;
    FlexibleRockeyHoc.defaultProps = BaseComponent.defaultProps;

    return FlexibleRockeyHoc;
  };

  return RockeyHoc;
};

const RockeyHoc = getRockeyHoc();
export default RockeyHoc;
