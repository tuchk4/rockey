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

test('complex selectors #1', () => {
  const parsed = parse(
    `
    Bar {
      font-size: 10px;

      + NextChild {
        color: red'
      }

      ~ NextFirst {
        padding: 20px;
      }

      color: green;

      WarningButton, PrimaryButton, SucceessButton {
        padding: 10px;
      }
    }
  `
  );

  // expect(parsed).toMatchSnapshot();
  const generated = generateCss(parsed);

  expect(generated.css).toMatchSnapshot();
});

test('complex selectors #2', () => {
  const parsed = parse(
    `
    Bar, Foo {
      font-size: 10px;

      WarningButton, PrimaryButton, SucceessButton {
        padding: 10px;

        + Icon {
          padding-right: 15px;
        }

        Spinner {
          color: yellow;
        }

        :hover, :active, :focus {
          color: red;
        }

        @media (max-width: 699px) {
          background: green;
        }
      }
    }
  `
  );

  // expect(parsed).toMatchSnapshot();
  const generated = generateCss(parsed);

  expect(generated.css).toMatchSnapshot();
});
