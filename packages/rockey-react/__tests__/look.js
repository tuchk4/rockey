import React from 'react';
import isFunction from 'lodash/isFunction';
import renderer from 'react-test-renderer';

import look from '../lib/look';

jest.mock('rockey/utils/hash', () => {
  return () => '{{ hash }}';
});

describe('look', () => {
  it('when', () => {
    expect(isFunction(look.when)).toBeTruthy();
  });

  it('condition', () => {
    expect(isFunction(look.condition)).toBeTruthy();
  });

  it('insert', () => {
    expect(isFunction(look.insert)).toBeTruthy();
  });
});

test('Look without components', () => {
  expect(() => look.button``).toThrow(
    'Rockey look should containt at least one root component'
  );
});

test('Look shortcuts', () => {
  const { Button, PrimaryButton } = look.button`
    Button {
      color: red;
      font-size: bold;
    }

    PrimaryButton {
      color: blue;
    }
  `;

  const ButtonTree = renderer.create(<Button>Button</Button>).toJSON();
  expect(ButtonTree).toMatchSnapshot();

  const PrimaryButtonTree = renderer
    .create(<PrimaryButton>PrimaryButton</PrimaryButton>)
    .toJSON();
  expect(PrimaryButtonTree).toMatchSnapshot();
});

test('Look', () => {
  const { Layer, PrimaryLayer } = look(({ children, className }) => (
    <div className={className}>{children}</div>
  ))`
    Layer {
      padding: 10px;
      border: 1px solid #000;
      color: green;
    }

    PrimaryLayer {
      color: red;
    }
  `;

  expect(isFunction(Layer)).toBeTruthy();
  expect(isFunction(PrimaryLayer)).toBeTruthy();

  const LayerTree = renderer.create(<Layer>Layer</Layer>).toJSON();
  expect(LayerTree).toMatchSnapshot();

  const PrimaryLayerTree = renderer
    .create(<PrimaryLayer>PrimaryLayer</PrimaryLayer>)
    .toJSON();
  expect(PrimaryLayerTree).toMatchSnapshot();
});
