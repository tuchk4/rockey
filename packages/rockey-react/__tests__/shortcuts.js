import isFunction from 'lodash/isFunction';
import RockeyHoc from '../lib';
import htmlTags from '../lib/htmlTags';

describe('shortcuts', () => {
  it('shortcuts', () => {
    htmlTags.forEach(tag => {
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
    expect(Button.name).toEqual('FlexibleRockeyHoc');
    expect(Button.displayName).toEqual('Rockey(ShortcutButton1)');

    expect(isFunction(MyButton)).toBeTruthy();
    expect(MyButton.name).toEqual('FlexibleRockeyHoc');
    expect(MyButton.displayName).toEqual('Rockey(MyButton)');
  });
});
