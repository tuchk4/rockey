import rule from '../lib/rule';
import * as styleSheetsModule from '../lib/styleSheets';

jest.mock('../lib/utils/hash', () => {
  return () => 'hash';
});

const insert = jest.fn();
styleSheetsModule.default = insert;

const color = 'red';

test('callTypes', () => {
  const css1 = rule`
    Button {
      color: red;
    }
  `;

  const css2 = rule(`
    Button {
      color: red;
    }
  `);

  const css3 = rule`
    Button {
      color: ${color};
    }
  `;

  const css4 = rule([
    {
      selector: ['.Button-hash'],
      root: ['Button'],
      media: null,
      mixins: [],
      styles: {
        color: 'red',
      },
    },
  ]);

  const classList1 = css1.getClassList();
  const classList2 = css2.getClassList();
  const classList3 = css3.getClassList();
  const classList4 = css4.getClassList();

  expect(classList1).toMatchSnapshot();
  expect(classList2).toMatchSnapshot();
  expect(classList3).toMatchSnapshot();
  expect(classList4).toMatchSnapshot();

  expect(insert.mock.calls[1]).toEqual(insert.mock.calls[0]);
  expect(insert.mock.calls[2]).toEqual(insert.mock.calls[0]);
  expect(insert.mock.calls[3]).toEqual(insert.mock.calls[0]);
});
