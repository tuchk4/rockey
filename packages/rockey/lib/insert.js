import { rule, staticRule } from './rule';

const insert = (strings, ...values) => {
  const css = rule(strings, ...values);

  css.wrapWith(`Insert`);
  return (props = {}) => css.getClassList(props).Insert;
};

export const insertStatic = (strings, ...values) => {
  const css = staticRule(strings, ...values);

  css.wrapWith(`InsertStatic`);
  return css.getClassList().InsertStatic;
};

export default insert;
