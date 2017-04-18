import React from 'react';
import classnames from 'classnames';

export default class RockeyHocWithHandlers extends React.Component {
  missedHandler = {};

  componentWillMount() {
    this.props.handlers.forEach(handler => {
      handler.clear();
    });
  }

  render() {
    const {
      handlers,
      proxy,
      css,
      selector,
      BaseComponent,
    } = this.props;

    const componentHandlers = {};
    const groupedHandlers = {};

    handlers.forEach(handler => {
      this.missedHandler[handler.event] = false;

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

    return (
      <BaseComponent {...componentHandlers} className={className} {...proxy} />
    );
  }
}
