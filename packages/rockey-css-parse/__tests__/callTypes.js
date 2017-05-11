import createParser from '../lib/parse';
import { stringifyRules } from '../lib/stringify';

const parse = createParser({
  getClassName: component => `c-${component}-hash`,
  getMixinClassName: component => `m-${component}-hash`,
  getAnimationName: component => `a-${component}-hash`,
});

test('callTypes', () => {
  const parsed1 = parse(`
    Button {
      Icon {
        background-color: transparent;
      }

      Close {
        background-color: black;
      }
    }
  `);

  const css1 = stringifyRules(parsed1.precss);

  const parsed2 = parse`
    Button {
      Icon {
        background-color: transparent;
      }

      Close {
        background-color: black;
      }
    }`;

  const css2 = stringifyRules(parsed2.precss);

  expect(css1).toEqual(css2);
});
