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
  expect(getRules()).toEqual([]);
  expect(getMixins()).toEqual([]);

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

test('inserted styles with mixin', () => {
  clearStyles();
  clearStylesCache();

  const css = rule`
    Button {
      color: purple;

      ${primary}
    }
  `;

  expect(
    css.getClassList({
      isPrimary: true,
    })
  ).toEqual({
    Button: ['Button-{{ hash }}', 'Mixin-anonWhen-{{ hash }}-1'],
  });

  expect(getRules()).toEqual([]);
  expect(getMixins()).toEqual([]);

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

test('inserted above threshold', () => {
  clearStyles();
  clearStylesCache();

  const styles = [];

  for (let i = 0; i <= 200; i++) {
    styles.push(
      `
      Button${i} {
        color: purple;
      }
    `
    );
  }

  const css = rule`${styles.join('')}`;

  css.getClassList();

  expect(getRules().length).toBeGreaterThan(0);
  expect(getMixins().length).toEqual(0);

  expect(getRules()).toMatchSnapshot();

  expect(getMixins()).toMatchSnapshot();
});
