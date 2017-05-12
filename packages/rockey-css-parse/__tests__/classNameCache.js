import createParser from '../lib/parse';

const getClassName = jest.fn();
const parse = createParser({
  getClassName,
});

test('classname cache', () => {
  parse(`
    Button {
      color: red;
    }

    Button {
      font-size: 10px;
    }
  `);

  expect(getClassName.mock.calls.length).toEqual(1);
});
