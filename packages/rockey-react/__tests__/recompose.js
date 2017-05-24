import React from 'react';
import 'react-dom';
import renderer from 'react-test-renderer';
import { withProps, mapProps } from 'recompose';

import rockempose from '../lib/recompose';

jest.mock('rockey/utils/hash', () => {
  return () => '-hash-';
});

test('Render recompose', () => {
  let i = 0;

  const Button = rockempose.button(
    withProps(props => ({
      bg: 'yellow',
    })),
    mapProps(props => ({
      ...props,
      c: props.bg,
    }))
  )`
    color: ${props => props.c}
    bg: ${props => props.bg}
  `;

  const ButtonTree = renderer.create(<Button>Button</Button>).toJSON();
  expect(ButtonTree).toMatchSnapshot();
});

test('Render recompose with name', () => {
  let i = 0;

  const Button = rockempose.button(
    'MyButtonYo',
    withProps(props => ({
      bg: 'yellow',
    })),
    mapProps(props => ({
      ...props,
      c: props.bg,
    }))
  )`
    color: ${props => props.c}
    bg: ${props => props.bg}
  `;

  const ButtonTree = renderer.create(<Button>Button</Button>).toJSON();
  expect(ButtonTree).toMatchSnapshot();
});

test('Render recompose custom component', () => {
  let i = 0;

  const Button = rockempose(({ children, ...props }) => (
    <button {...props}>{children}</button>
  ))(
    withProps(props => ({
      bg: 'yellow',
    })),
    mapProps(props => ({
      ...props,
      c: props.bg,
    }))
  )`
    color: ${props => props.c}
    bg: ${props => props.bg}
  `;

  const ButtonTree = renderer.create(<Button>Button</Button>).toJSON();
  expect(ButtonTree).toMatchSnapshot();
});
