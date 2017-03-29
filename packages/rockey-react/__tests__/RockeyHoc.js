import React from 'react';
import isFunction from 'lodash/isFunction';
import renderer from 'react-test-renderer';

import rockey from '../lib';

jest.mock('rockey/utils/hash', () => {
  return () => '{{ hash }}';
});

describe('RockeyHoc', () => {
  it('when', () => {
    expect(isFunction(rockey.when)).toBeTruthy();
  });

  it('condition', () => {
    expect(isFunction(rockey.condition)).toBeTruthy();
  });

  it('insert', () => {
    expect(isFunction(rockey.insert)).toBeTruthy();
  });
});

test('Anonymys rockey', () => {
  const Div = rockey(({ className }) => <div className={className}>Yo</div>)`
    padding: 10px;
    border: 1px solid #000;
  `;

  const tree = renderer.create(<Div />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('rockey with displayName', () => {
  const MyDiv = rockey('MyDiv', ({ className }) => (
    <div className={className}>Yo</div>
  ))`
    padding: 10px;
    border: 1px solid #000;
  `;

  const tree = renderer.create(<MyDiv />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('rockey shortcut', () => {
  const Button = rockey.button`
    padding: 10px;
    border: 1px solid #000;
  `;

  const tree = renderer.create(<Button />);
  expect(tree).toMatchSnapshot();
});

test('rockey shortcut and extend', () => {
  const Button = rockey.button`
    color; red;
    border: 1px solid #000;
  `;

  const PrimaryButton = Button`
    color: blue;
  `;

  const tree = renderer.create(<PrimaryButton />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('rockey named shortcut and named extend', () => {
  const Button = rockey.button('MyButton')`
    color; red;
    border: 1px solid #000;
  `;

  const PrimaryButton = Button('PrimaryButton')`
    color: blue;
  `;

  const tree = renderer.create(<PrimaryButton />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('rockey named shortcut and named extend with custom className', () => {
  const YourButton = rockey.button('YourButton')`
    color; red;
    border: 1px solid #000;
  `;

  const PrimaryButton = YourButton('PrimaryYourButton')`
    color: blue;
  `;

  const YourButtonTree = renderer
    .create(<YourButton className="custom-class-name" />)
    .toJSON();
  expect(YourButtonTree).toMatchSnapshot();

  const PrimaryButtonTree = renderer
    .create(<PrimaryButton className="custom-class-name" />)
    .toJSON();
  expect(PrimaryButtonTree).toMatchSnapshot();
});
