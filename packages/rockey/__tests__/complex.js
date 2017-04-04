import parse from '../lib/css/parse';
import generateCss from '../lib/css/generateCss';

jest.mock('../lib/utils/hash', () => {
  return () => '{{ hash }}';
});

test('complex', () => {
  const parsed = parse(
    `
    Button {
      :not([disabled]):hover {
        background-color: transparent
      }
    }
  `
  );

  expect(parsed).toMatchSnapshot();
  const generated = generateCss(parsed);

  expect(generated.css).toMatchSnapshot();
});

test('coma in modificators', () => {
  const parsed = parse(
    `
    Layer {
      ::after, ::before {
        color: red;
      }
    }
  `
  );

  expect(parsed).toMatchSnapshot();
  const generated = generateCss(parsed);

  expect(generated.css).toMatchSnapshot();
});
