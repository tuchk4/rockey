import { clearStylesCache } from '../lib/rule';
import insert, { insertStatic } from '../lib/insert';
import * as styleSheetsModule from '../lib/styleSheets';

const insertRules = jest.fn();
const insertMixins = jest.fn();

styleSheetsModule.insertRules = insertRules;
styleSheetsModule.insertMixins = insertMixins;

jest.mock('../lib/utils/hash', () => {
  return () => '{{ hash }}';
});

describe('insert', () => {
  beforeEach(() => {
    insertRules.mockClear();
    insertMixins.mockClear();
    clearStylesCache();
  });

  it('insert', () => {
    const css = insert`
      color: red;

      ${props => `
        background: #ffcc33;
      `}
    `;

    expect(css()).toEqual(['Insert-{{ hash }}', 'Mixin-anon-{{ hash }}-1']);

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '.Insert-{{ hash }}': {
        color: 'red',
      },
    });

    expect(insertMixins.mock.calls.length).toEqual(1);
    expect(insertMixins.mock.calls[0][0]).toEqual({
      '.Mixin-anon-{{ hash }}-1.Insert-{{ hash }}': {
        background: '#ffcc33',
      },
    });
  });

  it('insert static', () => {
    const classList = insertStatic`
      Button {
        color: red;
      }
    `;

    expect(classList).toEqual(['InsertStatic-{{ hash }}']);

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '.InsertStatic-{{ hash }} .Button-{{ hash }}': {
        color: 'red',
      },
    });
  });
});
