import React from 'react';
import PropTypes from 'prop-types';

export const CONTEXT_KEY = 'RockeyTheme';

class RockeyThemeProvider extends React.Component {
  static contextTypes = {
    [CONTEXT_KEY]: PropTypes.object,
  };

  static childContextTypes = {
    [CONTEXT_KEY]: PropTypes.object,
  };

  static propTypes = {
    theme: PropTypes.object,
  };

  getChildContext() {
    const theme = {
      ...this.context[CONTEXT_KEY],
      ...(this.props.theme || {}),
    };

    return {
      [CONTEXT_KEY]: theme,
    };
  }

  render() {
    return this.props.children;
  }
}

export default RockeyThemeProvider;
