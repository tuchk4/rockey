import createParser from '../lib/parse';
import { stringify } from '../lib/stringify';

const parse = createParser({
  getClassName: component => `c-${component}-hash`,
  getMixinClassName: component => `m-${component}-hash`,
  getAnimationName: component => `a-${component}-hash`,
});

test('stringify with props', () => {
  const { precss } = parse`
    Button {
      color: red;
      background: ${props => props.bg};
    }
  `;

  const css = stringify(precss, {
    bg: '#ffcc33',
  });

  expect(css).toMatchSnapshot();
});
