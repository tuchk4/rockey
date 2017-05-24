import React from 'react';
import 'react-dom';
import renderer from 'react-test-renderer';

import rockey from '../lib/';
import look from '../lib/look';

jest.mock('rockey/utils/hash', () => {
  return () => '{{ hash }}';
});

test('Advanced look #1', () => {
  const Button = rockey.button('MyButton');

  Button.look`
    Primary {
      color: blue;
    }

    Warning {
      color: red;
    }
  `;

  const { SuccessButton, AlertButton } = look(Button.Primary)`
    SuccessButton {
      border: 1px solid green;
    }

    AlertButton {
      border: 1px solid red;
    }
  `;

  const PrimaryTree = renderer
    .create(<Button.Primary>Button.Primary</Button.Primary>)
    .toJSON();
  expect(PrimaryTree).toMatchSnapshot();

  const WarningTree = renderer
    .create(<Button.Warning>Button.Warning</Button.Warning>)
    .toJSON();
  expect(WarningTree).toMatchSnapshot();

  const SuccessButtonTree = renderer
    .create(<SuccessButton>SuccessButton</SuccessButton>)
    .toJSON();
  expect(SuccessButtonTree).toMatchSnapshot();

  // expect(SuccessButtonTree).toEqual(
  //   renderer
  //     .create(
  //       <Button.Primary.SuccessButton>
  //         SuccessButton
  //       </Button.Primary.SuccessButton>
  //     )
  //     .toJSON()
  // );

  const AlertButtonTree = renderer
    .create(<AlertButton>AlertButton</AlertButton>)
    .toJSON();
  expect(AlertButtonTree).toMatchSnapshot();

  AlertButton.look`
    Large {
      font-size: 15px;
    }

    Small {
      font-size: 15px;
    }
  `;

  const AlertButtonLargeTree = renderer
    .create(<AlertButton.Large>AlertButton.Large</AlertButton.Large>)
    .toJSON();
  expect(AlertButtonLargeTree).toMatchSnapshot();

  const AlertButtonSmallTree = renderer
    .create(<AlertButton.Small>AlertButton.Small</AlertButton.Small>)
    .toJSON();
  expect(AlertButtonSmallTree).toMatchSnapshot();
});
