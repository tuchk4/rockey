import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { createDynamicRule } from 'rockey/styleSheets';
import hash from 'rockey/utils/hash';

import createElement from './utils/createElement';
import { CONTEXT_KEY } from './RockeyThemeProvider';

const HANDLERS_SHOULD_BE_RESETED_ON_OUT = ['onMouseMove', 'onMouseOver'];
const HANDLERS_SHOULD_BE_RESETED_ON_OVER = ['onMouseOut'];

const reset = (list, handlers, missed, forceUpdate) => {
  list.forEach(event => {
    handlers.filter(handler => handler.event === event).forEach(handler => {
      handler.clear();

      if (!missed[handler.event]) {
        forceUpdate();
      }
    });
  });
};

const resetOnOver = (handlers, missed, forceUpdate) => {
  reset(HANDLERS_SHOULD_BE_RESETED_ON_OVER, handlers, missed, forceUpdate);
};

const resetOnOut = (handlers, missed, forceUpdate) => {
  reset(HANDLERS_SHOULD_BE_RESETED_ON_OUT, handlers, missed, forceUpdate);
};

const withHandlers = ({ props, forceUpdate, handlers, missedHandler }) => {
  const componentHandlers = {};
  const groupedHandlers = {};

  let resetonOut = false;
  let resetonOver = false;

  handlers.forEach(handler => {
    missedHandler[handler.event] = false;

    if (HANDLERS_SHOULD_BE_RESETED_ON_OUT.indexOf(handler.event) !== -1) {
      resetonOut = true;
    }

    if (HANDLERS_SHOULD_BE_RESETED_ON_OVER.indexOf(handler.event) !== -1) {
      resetonOver = true;
    }

    if (!componentHandlers[handler.event]) {
      componentHandlers[handler.event] = (e, ...args) => {
        e.persist();

        if (props[handler.event]) {
          props[handler.event](e, ...args);
        }

        groupedHandlers[handler.event].forEach(handler => {
          handler(e, ...args);
        });
      };
    }

    if (!groupedHandlers[handler.event]) {
      groupedHandlers[handler.event] = [];
    }

    groupedHandlers[handler.event].push((...args) => {
      if (handler.assign(...args, props)) {
        missedHandler[handler.event] = false;

        forceUpdate();
      } else {
        if (!missedHandler[handler.event]) {
          forceUpdate();
        }

        missedHandler[handler.event] = true;
      }
    });
  });

  // reset handlers
  if (resetonOut) {
    const onMouseOut = componentHandlers.onMouseOut;
    componentHandlers.onMouseOut = (...args) => {
      if (onMouseOut) {
        onMouseOut(...args);
      }

      resetOnOut(handlers, missedHandler, () => {
        this.forceUpdate();
      });
    };
  }

  if (resetonOver) {
    const onMouseOver = componentHandlers.onMouseOver;
    componentHandlers.onMouseOver = (...args) => {
      if (onMouseOver) {
        onMouseOver(...args);
      }

      resetOnOver(handlers, missedHandler, () => {
        forceUpdate();
      });
    };
  }

  return componentHandlers;
};

export default class RockeyComponent extends React.Component {
  static contextTypes = {
    [CONTEXT_KEY]: PropTypes.object,
  };

  // state = {
  //   varsClassName: null,
  //   staticClassName: null,
  //   dynamicClassName: null,
  // };

  // varsClassName = null;
  staticClassName = null;
  // dynamicClassName = null;

  missedHandler = {};

  dom = null;
  dynamicRule = null;

  getRockeyProps(props, context) {
    const { componentProps } = this.props;
    const theme = this.context[CONTEXT_KEY];

    return {
      ...(props || this.props.componentProps),
      theme: context ? context[CONTEXT_KEY] : this.context[CONTEXT_KEY],
    };
  }

  componentWillMount() {
    // NOTE: redev selector behavior
    const { rockeyCSSRule, selector } = this.props;
    const classList = rockeyCSSRule.getStaticClassList();

    this.staticClassName = classList[selector];

    // this.setState({
    //   staticClassName: classList[selector],
    // });

    if (this.props.handlers) {
      this.props.handlers.forEach(handler => {
        handler.clear();
      });
    }
  }

  componentDidMount() {
    this.dom = ReactDOM.findDOMNode(this);

    const CSSProps = this.getRockeyProps();
    this.updateCSSVariables(CSSProps);
  }
  //
  // componentWillReceiveProps({ componentProps, rockeyCSSRule }, context) {
  //   if (this.dom) {
  //     const CSSProps = this.getRockeyProps(componentProps, context);
  //     this.updateDynamicClassName(CSSProps);
  //     this.updateCSSVariables(CSSProps);
  //   }
  // }

  // updateDynamicClassName(props) {
  //   this.updateCSSVariables(props);
  //
  //   const { selector } = this.props;
  //   const classList = this.props.rockeyCSSRule.getDynamicCSS(props);
  //
  //   if (classList[selector]) {
  //     this.dom.classList.add(classList[selector]);
  //   }

  // this.dynamicClassName = classList[selector];
  // this.setState({
  //   dynamicClassName: classList[selector],
  // });
  // }

  updateCSSVariables(props) {
    const CSSVariables = this.props.rockeyCSSRule.getCSSVariables(props);
    Object.keys(CSSVariables).forEach(v => {
      // TODO: rm propterty
      this.dom.style.setProperty(`--${v}`, CSSVariables[v]);
    });
    // const vars = Object.keys(CSSVariables);

    // if (vars.length) {
    //   if (!this.varsRule) {
    //     this.createVarsRule();
    //   }

    //   const rules = {};
    //   for (let i = 0, s = vars.length; i < s; i++) {
    //     rules[`--${vars[i]}`] = CSSVariables[vars[i]];
    //   }
    //
    //   this.varsRule.update(rules);
    // }
  }

  // createVarsRule() {
  //   const varsClassName = `${this.staticClassName}-vars-${hash()}`;
  //   this.varsRule = createDynamicRule(varsClassName);
  //
  //   this.dom.classList.add(varsClassName);

  // this.setState({
  //   varsClassName,
  // });
  // }

  render() {
    const { rockeyCSSRule, Component, selector, componentProps } = this.props;

    const CSSProps = this.getRockeyProps();

    const classList = rockeyCSSRule.getDynamicCSS(CSSProps);

    const className = classnames(
      this.staticClassName,
      classList[selector],
      // this.state.staticClassName,
      // this.state.varsClassName,
      // this.state.dynamicClassName,
      componentProps.className
    );

    let handlers = {};
    if (this.props.handlers) {
      handlers = withHandlers({
        forceUpdate: this.forceUpdate,
        handlers: this.props.handlers,
        missedHandler: this.missedHandler,
      });
    }

    return createElement(Component, {
      ...componentProps,
      ...handlers,
      className,
    });
  }
}
