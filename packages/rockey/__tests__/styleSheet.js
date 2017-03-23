import rule, { staticRule, clearStylesCache } from '../lib/rule';
import when from '../lib/when';
import { getClassName } from '../lib/css/getClassName';
import { getRules, getMixins, clearStyles } from '../lib/styleSheets';

jest.mock('../lib/utils/hash', () => {
  return () => '{{ hash }}';
});

console.warn = jest.fn();

const primary = when(props => props.isPrimary)`
  color: blue
`;

test('inserted styles', () => {
  clearStyles();
  clearStylesCache();

  const css = rule`
    Button {
      color: red;

      ${primary}
    }
  `;

  expect(css.getClassList()).toEqual({
    Button: ['Button-{{ hash }}'],
  });

  expect(getRules()).toMatchSnapshot();
  expect(getMixins()).toMatchSnapshot();

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        expect(getRules()).toMatchSnapshot();
        expect(getMixins()).toMatchSnapshot();

        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });
});

test('inserted styles batching', () => {
  clearStyles();
  clearStylesCache();

  return new Promise(
    (resolve, reject) => {
      setTimeout(() => {
        const css1 = rule` Button1 { color: red; }`;
        const css2 = rule` Button2 { color: red; }`;
        const css3 = rule` Button3 { color: red; }`;
        // const css4 = rule` Button4 { color: red; }`;
        // const css5 = rule` Button5 { color: red; }`;

        css1.getClassList();
        expect(getRules().length).toEqual(1);

        css2.getClassList();
        css3.getClassList();
        expect(getRules().length).toEqual(1);

        setTimeout(
          () => {
            try {
              expect(getRules().length).toEqual(3);

              resolve();
            } catch (e) {
              reject(e);
            }
          },
          5
        );
      });
    },
    5
  );
});

// test('inserted styles with mixin', () => {
//   clearStyles();
//   clearStylesCache();
//
//   const css = rule`
//     Button {
//       color: purple;
//
//       ${primary}
//     }
//   `;
//
//   expect(
//     css.getClassList({
//       isPrimary: true,
//     })
//   ).toEqual({
//     Button: ['Button-{{ hash }}', 'Mixin-anonWhen-{{ hash }}-1'],
//   });
//
//
//   expect(getRules()).toMatchSnapshot();
//   expect(getMixins()).toMatchSnapshot();
//
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       try {
//         expect(getRules()).toMatchSnapshot();
//         expect(getMixins()).toMatchSnapshot();
//
//         resolve();
//       } catch (e) {
//         reject(e);
//       }
//     });
//   });
// });

// test('inserted above threshold', () => {
//   clearStyles();
//   clearStylesCache();
//
//   const styles = [];
//
//   for (let i = 0; i <= 200; i++) {
//     styles.push(`
//       Button${i} {
//         color: purple;
//       }
//     `
//     );
//   }
//
//   const css = rule`${styles.join('')}`;
//
//   css.getClassList();
//
//   expect(getRules().length).toBeGreaterThan(0);
//   expect(getMixins().length).toEqual(0);
//
//   expect(getRules()).toMatchSnapshot();
//
//   expect(getMixins()).toMatchSnapshot();
// });
