import React from 'react';
import isFunction from 'lodash/isFunction';
import renderer from 'react-test-renderer';
import rockey from '../lib';

import * as styleSheetsModule from 'rockey/styleSheets';

jest.mock('rockey/utils/hash', () => {
  return () => '{{ hash }}';
});

const insertRules = jest.fn();
const insertMixins = jest.fn();

styleSheetsModule.insertRules = insertRules;
styleSheetsModule.insertMixins = insertMixins;

jest.mock('rockey/utils/hash', () => {
  return () => '{{ hash }}';
});

describe('Render cache', () => {
  beforeEach(() => {
    insertRules.mockClear();
    insertMixins.mockClear();
  });

  it('render cache', () => {
    const Button = rockey.button`
      color: red;
    `;

    renderer.create(<Button />).toJSON();

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '.ShortcutButton1-{{ hash }}': {
        color: 'red',
      },
    });

    renderer.create(<Button />).toJSON();
    expect(insertRules.mock.calls.length).toEqual(1);
  });

  it('render cache', () => {
    const getButton = () => rockey.button`
      color: blue;
    `;

    const Button1 = getButton();
    const Button2 = getButton();

    renderer.create(<Button1 />).toJSON();

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '.ShortcutButton2-{{ hash }}': {
        color: 'blue',
      },
    });

    renderer.create(<Button2 />).toJSON();

    expect(insertRules.mock.calls.length).toEqual(2);
    expect(insertRules.mock.calls[1][0]).toEqual({
      '.ShortcutButton3-{{ hash }}': {
        color: 'blue',
      },
    });
  });
});
