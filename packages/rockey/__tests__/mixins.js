import rule from '../lib/rule';
import when from '../lib/when';

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
                color: green;

                ${when(props => props.primary)`
                  color: red;
                `}

                background: ${props => (props.primary ? 'yellow' : 'green')}

                ${when('CustomName', props => props.primary)`
                  font-size: 20px;
                `}
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
  expect(insert.mock.calls).toMatchSnapshot();

  const classList2 = css.getClassList({
    primary: false,
  });

  expect(classList2).toMatchSnapshot();
  expect(insert.mock.calls).toMatchSnapshot();
});
