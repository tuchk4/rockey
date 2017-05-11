import createParser from '../lib/parse';

const parse = createParser({
  getClassName: component => `c-${component}-hash`,
  getMixinClassName: component => `m-${component}-hash`,
  getAnimationName: component => `a-${component}-hash`,
});

test('classList #1', () => {
  const parsed = parse(`
    Button {
      color: red;
    }
  `);

  expect(parsed.classList).toMatchSnapshot();
});

test('classList #2', () => {
  const parsed = parse(`
    Button, PrimaryButton, SuccessButton, span.hey {
      color: red;
    }
  `);

  expect(parsed.classList).toMatchSnapshot();
});
