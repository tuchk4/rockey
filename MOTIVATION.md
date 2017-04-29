### Table of contents:

- [I want to use small and fast lib](#i-want-to-use-small-and-fast-lib)
- [I want to split into looks](#i-want-to-split-into-looks)
- [I want CSS in JS with correct extending](#i-want-css-in-js-with-correct-extending)
- [I want to work with readable Class Names](#i-want-to-work-ith-readable-class-names)
- [Cleaner code and Component Based selectors](#cleaner-code-and-component-based-selectors)

# I want to use small and fast lib

And want to describe CSS using strings ([Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)) instead of JSON objects.

And I want to write [Dynamic CSS](https://github.com/tuchk4/rockey/tree/master/packages/rockey-react#dynamic-cssprops) and event [Dynamic CSS that depends on Event Handlers](https://github.com/tuchk4/rockey/tree/master/packages/rockey-react#dynamic-csseventhandlers).

Experimental demos:

- [Input styles for specific value](https://www.webpackbin.com/bins/-Ki22k9ewZ6gh3Rw87d-)
- [Div background depends on mouse X and Y](https://www.webpackbin.com/bins/-Ki1G10UY-sXlden2XSS)

#### Benchmark: parsing and generating CSS

```bash
npm run best-results -- --size 10000
```

- Rockey Parse Optimized — 3.325sec
- Rockey Parse — 3.841sec
- [Postcss](https://github.com/postcss/postcss) with [Nested Plugin](https://github.com/postcss/postcss-nested) 14.204sec
- [Postcss Safe Parser](https://github.com/postcss/postcss-safe-parser) with [Nested Plugin](https://github.com/postcss/postcss-nested) — 16.404sec

> Note that rockey and postcss were developed for different tasks. Rockey parser configured for specific syntax and will never be able to replace postcss

#### Benchmark: [A-gambit/CSS-IN-JS-Benchmarks](https://github.com/A-gambit/CSS-IN-JS-Benchmarks)

Results could be found [here](https://github.com/A-gambit/CSS-IN-JS-Benchmarks/blob/master/RESULT.md).

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

Demos (open devtools and try to change CSS rules for Base Components):

- [Button / PrimaryButton / SuccessButton with raised mixin](https://www.webpackbin.com/bins/-Ki2_Te-1y_OiIbQB5bO)
- [Card example](https://www.webpackbin.com/bins/-KfkcTYPzpyglHKfmuKh)
- [Warning Card example](https://www.webpackbin.com/bins/-Ki-AMdS7Q0bzkSyZ81f)

![gif how extends works](https://cdn-images-1.medium.com/max/1600/1*cOu2wXkCq6_m6RPQSkNtsA.gif)

# I want to work with readable Class Names

Demos (open devtools and watch classnames):

- [Button / PrimaryButton / SuccessButton with raised mixin](https://www.webpackbin.com/bins/-Ki2_Te-1y_OiIbQB5bO)
- [Card example](https://www.webpackbin.com/bins/-KfkcTYPzpyglHKfmuKh)
- [Warning Card example](https://www.webpackbin.com/bins/-Ki-AMdS7Q0bzkSyZ81f)

![Generated class names](https://cdn-images-1.medium.com/max/1600/1*Q0qkkBt0xYt0LXjBy-2fzg.png)

# Cleaner code and Component Based selectors

Demos (open devtools and watch classnames):

- [Button / PrimaryButton / SuccessButton with raised mixin](https://www.webpackbin.com/bins/-Ki2_Te-1y_OiIbQB5bO)
- [Card example](https://www.webpackbin.com/bins/-KfkcTYPzpyglHKfmuKh)
- [Warning Card example](https://www.webpackbin.com/bins/-Ki-AMdS7Q0bzkSyZ81f)

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
