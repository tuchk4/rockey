import React from 'react';
import classnames from 'classnames';

import isString from 'lodash/isString';
import isArray from 'lodash/isArray';

import rule from 'rockey/rule';
import look from './look';

import RockeyHocWithHandlers from './utils/RockeyHocWithHandlers';
import createElement from './utils/createElement';
// import { flush } from 'rockey/styleSheets';

import { ROCKEY_MIXIN_HANDLER_KEY } from './handler';

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

// class RockeyF extends React.Component {
//   classList = null;
//
//   componentWillMount() {
//     const { proxy, css, selector } = this.props;
//     this.classList = css.getClassList(proxy)[selector];
//   }
//
//   componentWillUpdate() {
//     const { proxy, css, selector } = this.props;
//     this.classList = css.getClassList(proxy)[selector];
//   }
//
//   render() {
//     const { proxy, BaseComponent } = this.props;
//
//     // const classList = css.getClassList(proxy);
//     // const className = classnames(this.classList, proxy.className);
//
//     return <BaseComponent {...proxy} className={this.classList} />;
//   }
// }

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

          let finshCssRule = null;
          if (at === DEFINE_COMPONENT_NAME) {
            // wrap with name because Function is used as React comopnent
            // but currect css object === parentCss. line :60
            finshCssRule = createEmtpyCss(name);
            finshCssRule.addParent(css);
          } else {
            finshCssRule = css;
          }

          // collect handler mixins
          const handlers = [];
          // TODO: remove this condition. mixins alwasy should be array
          if (finshCssRule.mixins) {
            Object.keys(finshCssRule.mixins).forEach(key => {
              const mixin = finshCssRule.mixins[key];

              if (mixin[ROCKEY_MIXIN_HANDLER_KEY]) {
                handlers.push(mixin);
              }
            });
          }

          if (handlers.length) {
            return (
              <RockeyHocWithHandlers
                css={finshCssRule}
                selector={name}
                handlers={handlers}
                BaseComponent={BaseComponent}
                proxy={props}
              />
            );
          } else {
            // return (
            //   <RockeyF
            //     css={finshCssRule}
            //     selector={name}
            //     BaseComponent={BaseComponent}
            //     proxy={props}
            //   />
            // );

            const classList = finshCssRule.getClassList(props);
            const className = classnames(classList[name], props.className);
            return createElement(BaseComponent, {
              ...props,
              className,
            });
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
