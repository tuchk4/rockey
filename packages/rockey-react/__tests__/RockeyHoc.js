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

test('rockey shortcut and named extend', () => {
  const Button = rockey.button`
    color; red;
    border: 1px solid #000;
  `;

  const PrimaryButton = Button('SuperPrimaryButton')`
    color: blue;
  `;

  const SuperButton = PrimaryButton`
    color: blue;
  `;

  const buttonTree = renderer.create(<Button />).toJSON();
  const primaryButtonTree = renderer.create(<PrimaryButton />).toJSON();
  const superButtonTree = renderer.create(<SuperButton />).toJSON();

  expect(buttonTree).toMatchSnapshot();
  expect(primaryButtonTree).toMatchSnapshot();
  expect(superButtonTree).toMatchSnapshot();
});

test('rockey named shortcut and named extend with custom className', () => {
  const BaseButton = rockey.button('BaseButton');

  const YourButton = BaseButton('YourButton')`
    color; red;
    border: 1px solid #000;
  `;

  const PrimaryButton = YourButton('PrimaryYourButton')`
    color: blue;
  `;

  const SecondaryButton = YourButton`
    color: blue;
  `;

  const SuperButton = SecondaryButton('SuperButton')`
    color: blue;
  `;

  const BaseButtonTree = renderer
    .create(<BaseButton className="custom-class-name" />)
    .toJSON();
  expect(BaseButtonTree).toMatchSnapshot();

  const YourButtonTree = renderer
    .create(<YourButton className="custom-class-name" />)
    .toJSON();
  expect(YourButtonTree).toMatchSnapshot();

  const PrimaryButtonTree = renderer
    .create(<PrimaryButton className="custom-class-name" />)
    .toJSON();
  expect(PrimaryButtonTree).toMatchSnapshot();

  const SecondaryButtonTree = renderer
    .create(<SecondaryButton className="custom-class-name" />)
    .toJSON();
  expect(SecondaryButtonTree).toMatchSnapshot();

  const SuperButtonTree = renderer
    .create(<SuperButton className="custom-class-name" />)
    .toJSON();
  expect(SuperButtonTree).toMatchSnapshot();
});
