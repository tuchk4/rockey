import { clearStylesCache } from '../lib/rule';
import insert from '../lib/insert';
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
    insert`
      Button {
        color: red;
      }
    `;

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '.Button-{{ hash }}': {
        color: 'red',
      },
    });
  });

  it('insert with mixin should throw exception', () => {
    expect(
      () => insert`
      Button {
        color: red;

        ${props => {}}
      }
    `
    ).toThrow('Static rule should not contain mixins');
  });
});
