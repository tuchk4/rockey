import generateCss from '../lib/css/generateCss';
import parse from '../lib/css/parse';
import parseOptimized from '../lib/css/parseOptimized';

import interpolateWithMixins from '../lib/mixins/interpolateWithMixins';

console.warn = jest.fn();

const SIZE = 10;

const generateRawCss = () => {
  let css = '';

  for (let i = 1; i <= SIZE; i++) {
    const { raw } = interpolateWithMixins`
      Button${i} {
        color: red;
        background: ${props => 'yellow'}
        Icon {
          color green;

          ${props => (props.primary ? `
            color: yellow;
          ` : null)}

          :hover {
            color: purple;

            @media (max-width: 500px) {
              background: black;
            }
          }
        }

        ${props => (props.primary ? `
          color: purple;
        ` : null)}

        ${props => (props.primary ? `
          background: yellow;
        ` : null)}
      }
    `;

    css += raw;
  }

  return css;
};

describe('compare', () => {
  it('original and optimized', () => {
    const css = generateRawCss();

    expect(generateCss(parse(css))).toEqual(generateCss(parseOptimized(css)));
  });
});
