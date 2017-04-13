# Rockey

Stressless styles for components using js. Write CSS with functional mixins according to the component structure using components names.

```bash
npm install --save rockey
```

![Rockey tests](https://api.travis-ci.org/tuchk4/rockey.svg?branch=master) ![rockey gzip size](http://img.badgesize.io/https://unpkg.com/rockey@0.0.5-alpha.32af5f74/rockey.min.js?compression=gzip&label=rockey%20gzip)

## Api

### rule

```js
import rockey from 'rockey';

const rule = rockey`
  Button {
    color: black;

    Icon {
      margin: 5px;
    }
  }
`;

const classList = rule.getClassList();
const className = classList.Button;
```

### rule methods.

> NOTE: that in most cases developers uses only *getClassList* and *addParent* methods.
Other methods are mostly used in internal rockey infrastructure, for integrations with
other libraries and for new features.

- **getClassList(props)** - returns class list for all defined components
- **addParent(rule)** - add parent rule. Class list will be merged with parent classes

```js
const baseButtonRule = rockey`
  Button {
    color: black;
    background: white;

    ${when(props => props.small)`
      font-size: 12px;
    `}
  }
`;

const primaryButtonRule = rockey`
  PrimaryButton {
    color: blue;
  }
`;

primaryButtonRule.addParent(baseButtonRule);

primaryButtonRule.getClassList({
  small: true
});
```

- **wrapWith(selector)** - wrap rules CSS with selector.

```js
const rule = rockey`
  Button {
    color: black;
  }
`;

rule.wrapWith('Layer');
```

Rules CSS will be:

```css
Layer {
   Button {
    color: black;
  }
}
```

- **addMixins(mixins)** - add mixins to rule
- **transform(callback)** - helps to split rule into multiple lesser rules and defined relations between them

For example: split rule into multiple rules and make each component to be child of previous component.

```js
const rule = rockey`
  Base {
    background: none;
  }

  Sized {
    font-size: 15px;
  }  

  Colored {
    color: red;
  }
`;

const components = rule.transform((tree, create) => {
  const rules = {};
  const components = Object.keys(tree.components);
  for (let i = 0; i < components.length; i++) {
    const displayName = components[i];
    const rule = create(tree.components[displayName]);

    if (i) {
      const parentName = components[i - 1]
      rule.addParent(rules[parentName]);
    }

    rules[displayName] = rule;
  }

  return rules;
});

components.Base.getClassList(); // [ "Base-{{ hash }}" ]
components.Sized.getClassList(); // [ "Sized-{{ hash }}", "Base-{{ hash }}" ]
components.Colored.getClassList(); // [ "Colored-{{ hash }}", "Sized-{{ hash }}", "Base-{{ hash }}" ]
```

### when

```js
import when from 'rockey/when';
import { when } from 'rockey';
```

Helps to to keep syntax much better and cleaner when use mixins.
Fulfilled each time when *getClassList()* is called.

```js
const rule = rockey`
  Button {
    color: black;

    ${when(props => props.primary)`
      color: blue;
    `}

    Icon {
      margin: 5px;
    }
  }
`;

const classList = rule.getClassList({
  primary: true
});
const className = classList.Button;
```

Access to props inside CSS rules:

```js
const rule = rockey`
  Button {
    color: black;

    ${when(props => props.color)(props => `
      color: ${props.color};
    `)}

    Icon {
      margin: 5px;
    }
  }
`;
```

To provide more readable mixin class name - define mixin name at first argument.
Resulted class name will be appended with hash.

```js
const rule = rockey`
  Button {
    color: black;

    ${when('isPrimary', props => props.primary)`
      color: blue;
    `}

    Icon {
      margin: 5px;
    }
  }
`;
```

### condition

```js
import rockey, { condition } from 'rockey';
import condition from 'rockey/condition';
```

Same as *when* but it is called only when CSS string is parsing.

```js
const rule = rockey`
  Button {
    color: black;

    ${condition(isMobile())`
      font-size: 10px;
    `}

    Icon {
      margin: 5px;
    }
  }
`;
```

### insert

Insert CSS rules to the DOM as is. Without any processing.

```js
import { insert } from 'rockey';
import insert from 'rockey/insert';

insert({
  'div': {
    'color': 'blue'
  },
  '.my-div': {
    'border': '1px solid #000'
  }
})
```

## Examples

```js
const buttonRule = rule`
  Button {
    padding: 5px;
    border: none;
    background: white;
    color: black;
  }
`;

const primaryButtonRule = rule`
  PrimaryButton {
    color: blue;  
  }
`;

primaryButtonRule.addParent(buttonRule);

primaryButtonRule.getClassList({});

{
  "PrimaryButton": ["PrimaryButton", "Button"]
}
```

Will render components (hash will be generated each time randomly):

```html
<Button class="Button-1fcd">
<Button class="PrimaryButton-ab4c Button-1fcd">
```
