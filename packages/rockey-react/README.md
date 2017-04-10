# Rockey React

![Rockey tests](https://api.travis-ci.org/tuchk4/rockey.svg?branch=master)

-  <img src="http://i.imgur.com/ULoeOL4.png" height="16"/> [Rockey at Medium](https://medium.com/@valeriy.sorokobatko/forgekit-785eb17a9b50#.bo3ijxdbm)

Examples:

- [Card and PrimaryCard](https://www.webpackbin.com/bins/-KflTRU8kd32oWs9VIKZ)
- [Extending](https://www.webpackbin.com/bins/-KflMmHbcVU01PD6h43F)
- [Animations](https://www.webpackbin.com/bins/-KflkDbSVrccxSkAAFZq)
- [When mixins](https://www.webpackbin.com/bins/-KflpZuJTEet-ECpPpWE)
- [Theme buttons](https://www.webpackbin.com/bins/-Kflsy2FIkQy4n27qeLc)


## Advantages

### Readable css class names

```js
const Button = rockey.button('Button')`
  padding: 5px;
  border: none;
  background: white;
  color: black;
`;

const PrimaryButton = Button('PrimaryButton')`
  color: blue;
`;

const WarningButton = Button('PrimaryButton')`
  color: red;
`;
```

Will render components (hash will be generated each time randomly):

```html
<Button class="Button-1fcd">
<Button class="PrimaryButton-ab4c Button-1fcd">
<Button class="WarningButton-fee2 Button-1fcd">
```




## Usage

```js
import rockey from 'rockey-react';

rockey(Component)`
 color: red;
`
```

### Extending

### Shortcuts

## Syntax

### Mixins

### Handlers mixins

### Look



```js
import rockey from 'rockey-react';

// anon button
const Button = rockey.button`
  color: red
`;

// named button
const PrimaryButton = rockey.button('PrimaryButton')`
  color: blue
`;


// extending
const SuperButton = PrimaryButton`
  font-weight: bold;
`;
```


```js
import look from 'rockey-react/look';

// anon button
const { Button, PrimaryButton, SuperButton } = look`
  Button {
    color: red

    :hover {
      color: green;
    }
  }

  PrimaryButton {
    color: blue;
  }

  SuperButton {
    font-weight: bold;
  }  
`;
```


```js
import rockey from 'rockey-react';
import look from 'rockey-react/look';

import Card from 'components/Card';

const Button = rockey.button('Button');
const Primary = rockey.button('Primary');

const { Card, PrimaryCard } = look(Card)`
  Card {
    CardHeader {
      height: 40px;
    }

    CardBody {
      padding: 15px;
    }

    CardFooter {
      height: 20px;

      Button {
        background: white;
      }

      PrimaryButton {
        font-weight: bold;
      }
    }
  }

  PrimaryCard {
    CardHeader {
      color: blue;
    }

    CardFooter {
      Button {
        background: blue;
      }
    }
  }
`;
```


------


### Nested Selectors

```js
const Header = rockey.div('Header')`
  font-size: 18px;
  font-weight: bold;
  padding: 5px;
`;

const CardBody = rockey.div('CardBody')`
 padding: 5px;
`;

const Card= rockey.div`
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-shadow: 1px 1px 3px #ccc;
  font-family: 'Roboto', sans-serif;
  width: 200px;

  Header {
    background: rgba(0, 0, 255, .1);
    color: #3399ff;
  }

  CardBody {
    ${when('error', props => props.error)`
      color: red;
    `}
  }
`;
```


### Write CSS that Depends on Props

React example:

```js
const Button = rockey.Button('MuButton');
render(<Button>Hello</Button>) // <Button class="MuButton-1fed">
```

To define name for mixin name use named function:
```js
import when from 'rockey/when';

const Button = rockey.button('MuButton')`
  color: red;
  ${when('isPrimary', props => props.primary)`
    color: blue;
  `}
`;

render(<Button primary={true}>Hello</Button>); // <Button class="MuButton-1fed isPrimary-eefc">
```

### Class Name Extending

This example available at [Webpakbin - Buttons](https://www.webpackbin.com/bins/-KflMmHbcVU01PD6h43F)
```js
import rockey from 'rockey-react';

// Create button from shortcut
const Button = rockey.button`
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: bold;
  padding: 5px;
  margin: 5px;
  background: white;
  border: 1px solid #ccc;
`;

// extending Button component and its styles with defined name
// with PrimaryButton displayName that is also used in className
const PrimaryButton = Button('PrimaryButton')`
  color: blue;
`;

// anonymous extending Button component and its styles
const SuperButton = PrimaryButton`
  color: red;
`;

render(<Button>Hello</Button>);
// <Button class="AnonButton1-ffea">

render(<PrimaryButton>Hello</PrimaryButton>);
// <Button class="PrimaryButton-1fed AnonButton1-ffea">

render(<SuperButton>Hello</SuperButton>);
// <Button class="ChildPrimaryButton1-cca3 PrimaryButton-1fed AnonButton1-ffea">
```
