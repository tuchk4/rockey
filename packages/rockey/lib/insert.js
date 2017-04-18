import { staticRule } from './rule';

export const insert = (strings, ...values) => {
  const css = staticRule(strings, ...values);
  css.getClassList();
};

export default insert;
