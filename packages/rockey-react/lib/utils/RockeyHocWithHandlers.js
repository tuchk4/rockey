import React from 'react';
import classnames from 'classnames';

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

export default class RockeyHocWithHandlers extends React.Component {
  missedHandler = {};

  componentWillMount() {
    this.props.handlers.forEach(handler => {
      handler.clear();
    });
  }

  render() {
    const { handlers, proxy, css, selector, BaseComponent } = this.props;

    const componentHandlers = {};
    const groupedHandlers = {};

    let resetonOut = false;
    let resetonOver = false;

    handlers.forEach(handler => {
      this.missedHandler[handler.event] = false;

      if (HANDLERS_SHOULD_BE_RESETED_ON_OUT.indexOf(handler.event) !== -1) {
        resetonOut = true;
      }

      if (HANDLERS_SHOULD_BE_RESETED_ON_OVER.indexOf(handler.event) !== -1) {
        resetonOver = true;
      }

      if (!componentHandlers[handler.event]) {
        componentHandlers[handler.event] = (e, ...args) => {
          e.persist();

          if (proxy[handler.event]) {
            proxy[handler.event](e, ...args);
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
        if (handler.assign(...args, proxy)) {
          this.missedHandler[handler.event] = false;

          this.forceUpdate();
        } else {
          if (!this.missedHandler[handler.event]) {
            this.forceUpdate();
          }

          this.missedHandler[handler.event] = true;
        }
      });
    });

    const classList = css.getClassList(proxy);
    const className = classnames(classList[selector], proxy.className);

    // reset handlers
    if (resetonOut) {
      const onMouseOut = componentHandlers.onMouseOut;
      componentHandlers.onMouseOut = (...args) => {
        if (onMouseOut) {
          onMouseOut(...args);
        }

        resetOnOut(this.props.handlers, this.missedHandler, () => {
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

        resetOnOver(this.props.handlers, this.missedHandler, () => {
          this.forceUpdate();
        });
      };
    }

    return (
      <BaseComponent {...proxy} {...componentHandlers} className={className} />
    );
  }
}
