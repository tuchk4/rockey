import createParser from '../lib/parse';
import { stringify } from '../lib/stringify';

const parse = createParser({
  getClassName: component => `c-${component}-hash`,
  getMixinClassName: component => `m-${component}-hash`,
  getAnimationName: component => `a-${component}-hash`,
});

test('parse css string correctly (wihtout mixins)', () => {
  const parsed = parse`
    Button {
      color: red;
      background: ${props => props.bg};
    }
  `;

  const css = stringify(parsed.precss);
  expect(css).toMatchSnapshot();

  parsed.precss.forEach(p => {
    p.mixins.forEach(mixin => {
      const { className, precss } = mixin({
        bg: 'yellow',
      });

      const mixinCss = stringify(precss);
      expect(mixinCss).toMatchSnapshot();
      expect(className).toMatchSnapshot();
    });
  });

  parsed.precss.forEach(p => {
    p.mixins.forEach(mixin => {
      const { className, precss } = mixin({
        bg: 'yellow',
      });
      expect(precss).toEqual(null);
      expect(className).toMatchSnapshot();
    });
  });
});

test('parse css string correctly (nested)', () => {
  const parsed = parse`
    A {
      B:active, B1, B2, B3 {
        C {
          D {
            E:hover {
              ${props => (props.prmiary ? 'color: red' : 'color: green')};
              background: ${props => (props.prmiary ? 'yellow' : 'green')}
            }
          }
        }
      }
    }
  `;

  parsed.precss.forEach(p => {
    p.mixins.forEach(mixin => {
      const { className, precss } = mixin({
        primary: true,
      });

      const mixinCss = stringify(precss);
      expect(mixinCss).toMatchSnapshot();
      expect(className).toMatchSnapshot();
    });
  });
});

test('multiple values', () => {
  const color = 'black';
  const size = '1px';
  const type = 'solid';

  const parsed = parse`
    A {
      border: ${size} ${type} ${color};
    }
  `;

  expect(stringify(parsed.precss)).toMatchSnapshot();
});
