import isFunction from 'lodash/isFunction';
import RockeyHoc from '../lib';
import htmlTags from 'html-tags';

describe('shortcuts', () => {
  it('shortcuts', () => {
    htmlTags.map(tag => {
      expect(isFunction(RockeyHoc[tag])).toBeTruthy();
    });
  });

  it('set shortcuts is disabled', () => {
    expect(() => {
      RockeyHoc.div = () => {};
    }).toThrow('Override default RockeyHoc shorcuts is disabled');
  });

  it('shortcut callType', () => {
    const Button = RockeyHoc.button`
      color: red;
    `;

    const MyButton = RockeyHoc.button('MyButton')`
      color: red;
    `;

    expect(isFunction(Button)).toBeTruthy();
    expect(Button.name).toEqual('RockeyHoc');
    expect(Button.displayName).toEqual('Rockey(ShortcutButton1)');

    expect(isFunction(MyButton)).toBeTruthy();
    expect(MyButton.name).toEqual('RockeyHoc');
    expect(MyButton.displayName).toEqual('Rockey(MyButton)');
  });
});
