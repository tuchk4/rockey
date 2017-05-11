import rule from '../lib/rule';

import * as styleSheetsModule from '../lib/styleSheets';

jest.mock('../lib/utils/hash', () => {
  return () => 'hash';
});

const insert = jest.fn();
styleSheetsModule.default = insert;

test('rule', () => {
  const css = rule`
    Button {
      color: red;
    }
  `;

  css.addMixins([props => (props.primary ? 'color:blue' : 'color:red')]);

  const classList = css.getClassList({
    primary: true,
  });

  expect(classList).toMatchSnapshot();
  expect(insert.mock.calls).toMatchSnapshot();

  const classList2 = css.getClassList({
    primary: false,
  });

  expect(classList2).toMatchSnapshot();
  expect(insert.mock.calls).toMatchSnapshot();
});
