import when from '../lib/when';
import rule from '../lib/rule';
import { clearStylesCache } from '../lib/rule';
import * as styleSheetsModule from '../lib/styleSheets';

jest.mock('../lib/utils/hash', () => {
  return () => '{{ hash }}';
});

const insertRules = jest.fn();
const insertMixins = jest.fn();

styleSheetsModule.insertRules = insertRules;
styleSheetsModule.insertMixins = insertMixins;

describe('when', () => {
  beforeEach(() => {
    clearStylesCache();
    insertRules.mockClear();
    insertMixins.mockClear();
  });

  it('when', () => {
    const whenFunc = when(props => props.isPrimary)`
      color: blue
    `;

    const raw = whenFunc();
    expect(raw).toEqual(null);
  });

  it('when proced', () => {
    const whenFunc = when(props => props.isPrimary)`
      color: blue
    `;

    const raw = whenFunc({
      isPrimary: true,
    });

    expect(raw.trim()).toEqual('color: blue');
  });

  it('named when proced', () => {
    const whenFunc = when('isPrimary', props => props.isPrimary)`
      color: blue
    `;

    const raw = whenFunc({
      isPrimary: true,
    });

    expect(raw.trim()).toEqual('color: blue');
  });

  it('rule with when', () => {
    const css = rule`
      Button {
        color: red;

        ${when(props => props.primary)`
          color: blue;
        `}
      }
    `;

    expect(
      css.getClassList({
        primary: true,
      })
    ).toEqual({
      Button: ['Button-{{ hash }}', 'Mixin-anonWhen-{{ hash }}-1'],
    });

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '.Button-{{ hash }}': {
        color: 'red',
      },
    });

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertMixins.mock.calls[0][0]).toEqual({
      '.Mixin-anonWhen-{{ hash }}-1.Button-{{ hash }}': {
        color: 'blue',
      },
    });
  });
});
