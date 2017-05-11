import rule from '../lib/rule';
import * as styleSheetsModule from '../lib/styleSheets';

jest.mock('../lib/utils/hash', () => {
  return () => 'hash';
});

const insert = jest.fn();
styleSheetsModule.default = insert;

test('wrapWith string', () => {
  insert.mockClear();
  const css = rule`
    Button {
      color: red;
      font-size: ${props => `${props.size}px`};
    }
  `;

  css.wrapWith('Layer');

  expect(
    css.getClassList({
      size: 2,
    })
  ).toMatchSnapshot();
  expect(insert.mock.calls).toMatchSnapshot();
});

test('wrapWith string (after already parsed)', () => {
  insert.mockClear();

  const css = rule`
    PrimaryButton {
      color: orange;
    }
  `;

  css.getClassList();

  expect(() => css.wrapWith('Layer')).toThrow(
    'Can not wrap because rule is already parsed and inserted'
  );
});

test('wrapWith string parsed', () => {
  insert.mockClear();

  const css = rule`
    Button {
      color: red;
      font-size: ${props => `${props.size}px`};
    }

    PrimaryButton {
      color: blue;
    }
  `;

  const { Button, PrimaryButton } = css.transform((tree, create) => {
    const components = Object.keys(tree);
    const size = components.length;

    const parentDisplayName = components[0];
    const baseCss = create(tree[parentDisplayName]);

    const children = {};

    for (let i = 1; i < size; i++) {
      const displayName = components[i];
      const comopnentCss = create(tree[displayName]);

      comopnentCss.addParent(baseCss);
      children[displayName] = comopnentCss;
    }

    return Object.assign({}, children, {
      [parentDisplayName]: baseCss,
    });
  });

  PrimaryButton.wrapWith('Layer');

  expect(
    PrimaryButton.getClassList({
      size: 10,
    })
  ).toMatchSnapshot();

  expect(
    Button.getClassList({
      size: 50,
    })
  ).toMatchSnapshot();

  expect(insert.mock.calls).toMatchSnapshot();
});
