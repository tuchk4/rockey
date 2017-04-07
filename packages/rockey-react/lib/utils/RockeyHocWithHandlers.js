import React from 'react';
import classnames from 'classnames';

export default class RockeyHocWithHandlers extends React.Component {
  missedHandler = false;

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

    handlers.forEach(handler => {
      componentHandlers[handler.event] = (e, ...args) => {
        e.persist();

        if (proxy[handler.event]) {
          proxy[handler.event](e, ...args);
        }

        if (handler.assign(e, ...args)) {
          this.missedHandler = false;

          this.forceUpdate();
        } else {
          if (!this.missedHandler) {
            this.forceUpdate();
          }

          this.missedHandler = true;
        }
      };
    });

    const classList = css.getClassList(proxy);
    const className = classnames(classList[selector], proxy.className);

    return (
      <BaseComponent {...componentHandlers} className={className} {...proxy} />
    );
  }
}
