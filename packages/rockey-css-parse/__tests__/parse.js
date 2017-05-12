import createParser from '../lib/parse';
import { stringify } from '../lib/stringify';

const parse = createParser({
  getClassName: component => `c-${component}-hash`,
  getMixinClassName: component => `m-${component}-hash`,
  getAnimationName: component => `a-${component}-hash`,
});

// let cssWithoutMixins = null;

test('parse css string correctly (wihtout mixins)', () => {
  const parsed = parse(`
    Button {
      :not([disabled]):hover {
        background-color: transparent;
      }

      :not(PrimaryButton.active):hover {
        background-color: black;
      }
    }

    Bar, Foo {
      font-size: 10px;

      @keyframes colorized {
        from { color: red; }
        to { color: #fc3; }
      }

      animation: colorized 10s infinity;

      WarningButton, PrimaryButton, SucceessButton {
        padding: 10px;
        margin: 10px;

        @keyframes example-first {
          0% { color: red; }
          100% { color: red; }
        }

        animation: example-first 10s infinity;

        + Icon {
          padding-right: 15px;

          @media (max-width: 199px) {
            color: purple;
          }
        }

        border: 10px;

        ~ Spinner {
          @media (max-width: 699px) {
            color: yellow;

            @keyframes example-first {
              0% { color: red; }
              40% { color: #fc3; }
              50% { color: red; }
              60% { color: black; width: 100px; }
              100% { color: red; }
            }

            animation: example-first 1s infinity;
          }
        }

        :hover, :active, :focus {
          color: red;

          @media (max-width: 100px) {
            color: green;
          }
        }

        @media (max-width: 1000px) {
          background: green;

          @keyframes example-first {
            0% { color: red; }
            50% { color: yellow; }
            100% { color: red; }
          }

          animation: example-first 1s infinity;
        }
      }
    }
  `);

  const css = stringify(parsed.precss);
  expect(css).toMatchSnapshot();
});

const firstFontSize = 1;

test('parse css string correctly (with mixins)', () => {
  const parsed = parse`
    Button {
      ${function firstMixin(props) {
        return `font-size: ${firstFontSize}px`;
      }}

      :not([disabled]):hover {
        ${props => `font-size: 2px`}
        background-color: transparent;
        ${props => `font-size: 3px`}
      }

      ${props => `font-size: 4px`}

      :not(PrimaryButton.active):hover {
        ${props => `font-size: 5px`}
        background-color: black;
        ${props => `font-size: 6px`}
      }

      ${props => `font-size: 7px`}
    }

    Bar, Foo {
      ${props => `font-size: 8px`}
      font-size: 10px;
      ${props => `font-size: 9px`}

      WarningButton, PrimaryButton, SucceessButton {
        ${props => `font-size: 10px`}
        padding: 10px;
        ${props => `font-size: 11px`}
        + Icon {
          ${props => `font-size: 12px`}
          padding-right: 15px;
          ${props => `font-size: 13px`}

          @media (max-width: 199px) {
            ${props => `font-size: 14px`}
            color: purple;
            ${props => `font-size: 15px`}
          }
        }
        ${props => `font-size: 16px`}
        margin: 10px;
        ${props => `font-size: 29px`}
        border: 10px;
        ${props => `font-size: 30px`}
        ~ Spinner {
          ${props => `font-size: 17px`}
          @media (max-width: 699px) {
            color: yellow;
          }
          ${props => `font-size: 18px`}
        }

        ${props => `font-size: 19px`}

        :hover, :active, :focus {
          ${props => `font-size: 20px`}
          color: red;
          ${props => `font-size: 21px`}

          @media (max-width: 100px) {
            ${props => `font-size: 22px`}
            color: green;
            ${props => `font-size: 23px`}
          }
        }

        ${props => `font-size: 24px`}
        @media (max-width: 1000px) {
          ${props => `font-size: 25px`}
          background: green;
          ${props => `font-size: 26px`}
        }
        ${props => `font-size: 27px`}
      }
      ${props => `font-size: 28px`}
    }
  `;

  const css = stringify(parsed.precss);
  expect(css).toMatchSnapshot();

  parsed.precss.forEach(p => {
    p.mixins.forEach(mixin => {
      const { precss } = mixin();
      const mixinCss = stringify(precss);
      expect(mixinCss).toMatchSnapshot();
    });
  });
});

test('parse css string correctly (with prop mixins)', () => {
  const parsed = parse`
    Button {
      :not([disabled]):hover {
        background-color: ${props => props.bg};
      }

      :not(PrimaryButton.active):hover {
        background-color: ${props => props.bg};
      }
    }

    Bar, Foo {
      font-size: ${props => props.fontSize && `${props.fontSize}px`};
      background: ${props => props.background && props.background};

      WarningButton, PrimaryButton, SucceessButton {
        padding: ${props => `${props.size}px`};
        margin: ${props => `${props.size}px`};

        + Icon {
          padding-right: ${props => `${props.size}px`};

          @media (max-width: 199px) {
            color: ${props => props.color};
          }
        }

        margin: ${props => `${props.size}px`};

        ~ Spinner {
          @media (max-width: 699px) {
            color: ${props => props.color};
          }
        }

        :hover, :active, :focus {
          color: ${props => props.color};

          @media (max-width: 100px) {
            color: ${props => props.color};
          }
        }

        @media (max-width: 1000px) {
          background: color: ${props => props.color};
        }
      }
    }
  `;

  const css = stringify(parsed.precss);
  expect(css).toMatchSnapshot();

  parsed.precss.forEach(p => {
    p.mixins.forEach(mixin => {
      const { precss } = mixin({
        color: 'red',
        size: 10,
        bg: 'green',
        // background: 'yellow',
        fontSize: 50,
      });

      if (precss) {
        const mixinCss = stringify(precss);
        expect(mixinCss).toMatchSnapshot();
      }
    });
  });
});

test('parse css string correctly (nested) + fallback', () => {
  const parsed = parse`
    A {
      color: #fc3;
      B:active {
        color: #fc3;
        C {
          color: #fc3;
          D {
            color: #fc3;
            E:hover {
              color: #fc3;
            }
            color: #333;
          }
          color: #333;
        }
        color: #333;
      }
      color: #333;
    }
  `;

  const css = stringify(parsed.precss);
  expect(css).toMatchSnapshot();
});
