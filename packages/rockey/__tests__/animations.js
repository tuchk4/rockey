import rule from '../lib/rule';
import { clearCachedClassNames } from '../lib/css/getClassName';
import * as styleSheetsModule from '../lib/styleSheets';

jest.mock('../lib/utils/hash', () => {
  return () => '{{ hash }}';
});

const insertRules = jest.fn();
const insertMixins = jest.fn();

styleSheetsModule.insertRules = insertRules;
styleSheetsModule.insertMixins = insertMixins;

console.warn = jest.fn();

describe('animation', () => {
  beforeEach(() => {
    clearCachedClassNames();
    console.warn.mockClear();
    insertRules.mockClear();
    insertMixins.mockClear();
  });

  it('single animation', () => {
    const css = rule`
      @keyframes example {
        0% { color: red };
        100% { color: green };
      }

      Button {
        animation: example 1s;
      }
    `;

    const classList = css.getClassList();

    expect(classList).toEqual({
      Button: ['Button-{{ hash }}'],
    });

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '@keyframes example-{{ hash }}': {
        '0%': { color: 'red' },
        '100%': { color: 'green' },
      },
      '.Button-{{ hash }}': {
        animation: 'example-{{ hash }} 1s',
      },
    });
  });

  it('double unused animation', () => {
    const css = rule`
      @keyframes example-1 {
        0% { color: red };
        100% { color: green };
      }

      @keyframes example-2 {
        0% { color: green };
        100% { color: red };
      }

      Button {
        animation: example 1s;
      }
    `;

    const classList = css.getClassList();

    expect(classList).toEqual({
      Button: ['Button-{{ hash }}'],
    });

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '@keyframes example-1-{{ hash }}': {
        '0%': { color: 'red' },
        '100%': { color: 'green' },
      },
      '@keyframes example-2-{{ hash }}': {
        '0%': { color: 'green' },
        '100%': { color: 'red' },
      },
      '.Button-{{ hash }}': {},
    });

    expect(console.warn.mock.calls.length).toEqual(1);
    expect(console.warn.mock.calls[0][0]).toEqual(
      '(generate error) "example" animation was requested but had not been defined'
    );
  });

  it('double  animation', () => {
    const css = rule`
      @keyframes example-1 {
        0% { color: red };
        100% { color: green };
      }

      @keyframes example-2 {
        0% { color: green };
        100% { color: red };
      }

      Button {
        animation: example-2 1s;
      }
    `;

    const classList = css.getClassList();

    expect(classList).toEqual({
      Button: ['Button-{{ hash }}'],
    });

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '@keyframes example-1-{{ hash }}': {
        '0%': { color: 'red' },
        '100%': { color: 'green' },
      },
      '@keyframes example-2-{{ hash }}': {
        '0%': { color: 'green' },
        '100%': { color: 'red' },
      },
      '.Button-{{ hash }}': {
        animation: 'example-2-{{ hash }} 1s',
      },
    });
  });

  it('single animation defined inside component', () => {
    const css = rule`
      Button {
        @keyframes example {
          0% { color: red };
          100% { color: green };
        }

        animation: example 1s;
      }
    `;

    const classList = css.getClassList();

    expect(classList).toEqual({
      Button: ['Button-{{ hash }}'],
    });

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '@keyframes example-{{ hash }}': {
        '0%': { color: 'red' },
        '100%': { color: 'green' },
      },
      '.Button-{{ hash }}': {
        animation: 'example-{{ hash }} 1s',
      },
    });
  });

  it('animation as proced mixin', () => {
    const css = rule`
      Button {
        ${props => props.isPrimary ? `
          @keyframes example {
            0% { color: red };
            100% { color: green };
          }

          animation: example 1s;
        ` : null}

        color: black;
      }
    `;

    const classList = css.getClassList({
      isPrimary: true,
    });

    expect(classList).toEqual({
      Button: ['Button-{{ hash }}', 'Mixin-anon-{{ hash }}-1'],
    });

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '.Button-{{ hash }}': {
        color: 'black',
      },
    });

    expect(insertMixins.mock.calls.length).toEqual(1);
    expect(insertMixins.mock.calls[0][0]).toEqual({
      '@keyframes example-{{ hash }}': {
        '0%': { color: 'red' },
        '100%': { color: 'green' },
      },
      '.Mixin-anon-{{ hash }}-1.Button-{{ hash }}': {
        animation: 'example-{{ hash }} 1s',
      },
    });
  });

  it('animation as mixin', () => {
    const css = rule`
      Button {
        ${props => props.isPrimary ? `
          @keyframes example {
            0% { color: red };
            100% { color: green };
          }

          animation: example 1s;
        ` : null}

        color: black;
      }
    `;

    const classList = css.getClassList();

    expect(classList).toEqual({
      Button: ['Button-{{ hash }}'],
    });

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '.Button-{{ hash }}': {
        color: 'black',
      },
    });

    expect(insertMixins.mock.calls.length).toEqual(0);
  });
});
