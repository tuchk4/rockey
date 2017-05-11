import createParser from '../lib/parse';
import { stringifyRules } from '../lib/stringify';

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

  const css = stringifyRules(parsed.precss);
  expect(css).toMatchSnapshot();

  parsed.precss.forEach(p => {
    p.mixins.forEach(mixin => {
      const { className, precss } = mixin({
        bg: 'yellow',
      });

      const mixinCss = stringifyRules(precss);
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

      const mixinCss = stringifyRules(precss);
      expect(mixinCss).toMatchSnapshot();
      expect(className).toMatchSnapshot();
    });
  });
});
