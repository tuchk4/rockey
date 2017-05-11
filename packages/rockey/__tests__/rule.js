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

      A {
        B:active, B1, B2, B3 {
          C {
            D {
              E:hover {
                ${props => (props.primary ? 'color: red' : 'color: green')};
                background: ${props => (props.primary ? 'yellow' : 'green')}

                ${props => props.primary && 'background: blue'};
              }
            }
          }
        }
      }
    }
  `;

  const classList = css.getClassList({
    primary: true,
  });

  expect(classList).toMatchSnapshot();
  expect(insert.mock.calls.length).toEqual(2);

  const classList2 = css.getClassList({
    primary: false,
  });
  expect(classList2).toMatchSnapshot();
  expect(insert.mock.calls.length).toEqual(3);
});

test('transform', () => {
  const css = rule`
    Button {
      color: red;
      background: ${props => (props.primary ? 'blue' : 'green')}
    }

    Button2 {
      color: red;
    }

    Button3 {
      color: red;
    }

    Button4 {
      color: red;
    }
  `;

  const { Button3, Button4 } = css.transform((tree, create) => {
    const components = Object.keys(tree);
    const size = components.length;

    const parentDisplayName = components[0];
    const baseCss = create(tree[parentDisplayName]);

    const children = {};

    for (let i = 1; i < size; i++) {
      const displayName = components[i];

      const comopnentCss = create(tree[displayName]);

      children[displayName] = comopnentCss;
    }

    return Object.assign({}, children, {
      [parentDisplayName]: baseCss,
    });
  });

  const classList = Button4.getClassList();
  expect(classList).toMatchSnapshot();

  const classList1 = Button4.getClassList({
    primary: true,
  });
  expect(classList1).toMatchSnapshot();

  const classList2 = Button3.getClassList();
  expect(classList2).toMatchSnapshot();

  const classList3 = Button3.getClassList({
    primary: true,
  });
  expect(classList3).toMatchSnapshot();
});
