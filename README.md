# Rockey

```js
import rockey from 'rockey';

const rule = rockey.rule`
  color: red;

  ${rockey.when(props => props.isPrimary)`
    color: blue
  `}
`;


rule.getClassList({
  isPrimary: true
})
```


# Rockey-React


Examples:

- [Card and PrimaryCard](https://www.webpackbin.com/bins/-KflTRU8kd32oWs9VIKZ)
- [Extending](https://www.webpackbin.com/bins/-KflMmHbcVU01PD6h43F)
- [Animations](https://www.webpackbin.com/bins/-KflkDbSVrccxSkAAFZq)
- [When mixins](https://www.webpackbin.com/bins/-KflpZuJTEet-ECpPpWE)
- [Theme buttons](https://www.webpackbin.com/bins/-Kflsy2FIkQy4n27qeLc)

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
