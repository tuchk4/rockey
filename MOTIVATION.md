### Table of contents:

- [I want to use small and fast lib](#i-want-to-use-small-and-fast-lib)
- [I want to split into looks](#i-want-to-split-into-looks)
- [I want CSS in JS with correct extending](#i-want-css-in-js-with-correct-extending)
- [Cleaner code and Component Based selectors](#cleaner-code-and-component-based-selectors)

# I want to use small and fast lib

And want to describe CSS using strings ([Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)) instead of JSON objects.

And I want to write [Dynamic CSS](https://github.com/tuchk4/rockey/tree/master/packages/rockey-react#dynamic-cssprops) and event [Dynamic CSS that depends on Event Handlers](https://github.com/tuchk4/rockey/tree/master/packages/rockey-react#dynamic-csseventhandlers).

# I want to split into looks

Demo: [Buttons look with mixins](https://www.webpackbin.com/bins/-Kiu3e_2HuGQx3vtnf0m)

```js
import look from 'rockey-react/look';

const { Button, PrimaryButton, SuccessButton } = look.button`
  Button {
    padding: 5px;
    background: none;

    ${rockey.when(props => props.raised)`
      box-shadow: 1px 1px 5px #ccc;
    `}

    font-size: ${props => `${0.9 * props.scale}em`};
  }

  PrimaryButton {
    color: blue;
  }

  SuccessButton {
    color: green;
  }
`
const render = () => {
  <Button raised scale="1.1">Button</Button>
  <PrimaryButton scale="2">PrimaryButton</PrimaryButton>
  <SuccessButton raised scale="1.5">SuccessButton</SuccessButton>
};
```

# I want CSS in JS with correct extending

![gif how extends works](https://cdn-images-1.medium.com/max/1600/1*cOu2wXkCq6_m6RPQSkNtsA.gif)

# Cleaner code and Component Based selectors

Main goal - keep code as clean as possible.

Write nested CSS according your components structure. Use real components names for CSS rules instead of classes.
Means that if you have component `<Card/>`  — use its name as CSS selector. If you have component `<PrimaryCard/>` — use its name as CSS selector. Use nested selectors according to components structure.

> With [Dynamic CSS](#https://github.com/tuchk4/rockey#dynamic-css) (or even with *rockey-react* - [Dynamic CSS - Event Handlers](#)) You will forgot about large and sometimes very unreadable `classnames` conditions. Just set className at Comopnent's root element.

```js
import rockey from 'rockey-react';
import Icon from 'icon';

const CardHeader = rockey.div('Card');
const CardBody = rockey.div('CardBody');
const CardActions = rockey.div('CardActions');
const Button = rockey.button('Button');
const CloseIcon = rockey(Icon);

const Card = props => {
  return (
    <Card>
      <CardHeader>
        <Title>I am  CardHeader</Title>
        <CloseIcon/>
      </CardHeader>
      <CardBody>I am Body</CardBody>
      <CardActions>
        <Button>Click me</Button>
      </CardActions>
    </Card>
  );
};

const StyledCard = rockey(Card)`
  Card {
    width: 100px;

    CardHeader {
      background: #fc3;

      CloseIcon {
        float: right;
      }
    }

    CardBody {
      padding: 15px;
    }

    CardActions {
      Button {
        float: right;
      }
    }  
  }
`;
```
