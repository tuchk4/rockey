import React from 'react';
import isString from 'lodash/isString';
import filterProps from './filterProps';

export default (type, props) => {
  // filter props for HTML tags
  return React.createElement(type, isString(type) ? filterProps(props) : props);
};
