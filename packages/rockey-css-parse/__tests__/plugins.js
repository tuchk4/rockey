import createParser from '../lib/parse';
import { stringify } from '../lib/stringify';

const parse = createParser({
  getClassName: component => `c-${component}-hash`,
  getMixinClassName: component => `m-${component}-hash`,
  getAnimationName: component => `a-${component}-hash`,
  plugins: [
    styles => {
      return {
        hacked: 'hacked',
      };
    },
  ],
});

// let cssWithoutMixins = null;

test('plugins', () => {
  const parsed = parse(`
    Button {
      Icon {
        background-color: transparent;
      }

      Close {
        background-color: black;
      }
    }
  `);

  const css = stringify(parsed.precss);
  expect(css).toMatchSnapshot();
});
