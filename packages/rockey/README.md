# Rockey

Stressless styles for components using js. Write CSS with functional mixins according to the component structure using components names.

<img src="http://i.imgur.com/ULoeOL4.png" height="16"/> [CSS in JS. Rockey](https://medium.com/@tuchk4/css-in-js-rockey-890ebbbd16e7)

```bash
npm install --save rockey
```

![Rockey tests](https://api.travis-ci.org/tuchk4/rockey.svg?branch=master) ![rockey gzip size](http://img.badgesize.io/https://unpkg.com/rockey@0.0.5-alpha.32af5f74/rockey.min.js?compression=gzip&label=rockey%20gzip)

## Api

- [rule](#rule)
  - [rule.getClassList](#rulegetclasslist)
  - [rule.addParent](#ruleaddparent)
  - [rule.wrapWith](#rulewrapwith)
  - [rule.addMixins](#ruleaddmixins)
  - [rule.transform](#ruletransform)
- [when](#when)
- [condition](#condition)
- [insert](#insert)

> NOTE: that in most cases developers uses only *getClassList* and *addParent* methods.
Other methods are mostly used in internal rockey infrastructure, for integrations with
other libraries and for new features.

### rule

Very similar with css-modules.

```js
import rule from 'rockey';

const css = rule`
  Button {
    color: black;

    Icon {
      margin: 5px;
    }
  }
`;
```

#### rule.getClassList

```js
import rule from 'rockey';

const css = rule`
  Button {
    color: black;

    Icon {
      margin: 5px;
    }
  }
`;

const classList = css.getClassList();
const className = classList.Button;
```

Inserted CSS:

```css
.Button-{{ hash }} {
  color: black;
}

.Button-{{ hash }} .Icon-{{ hash }} {
  margin: 5px;
}
```

#### rule.addParent

Add parent rule. Child rule class names will be merged with parent.
It is possible to add only one parent.

```js
import rule from 'rockey';

const baseButtonCss = rule`
  Button {
    color: black;
    background: white;

    ${props => props.small && `font-size: 12px;`}
  }
`;

const primaryButtonCss = rule`
  PrimaryButton {
    color: blue;
  }
`;

primaryButtonCss.addParent(baseButtonCss);

primaryButtonCss.getClassList({
  small: true
});

const className = primaryButtonCss.PrimaryButton
// ['PrimaryButton-{{ hash }}', 'Button-{{ hash }}', 'AnonMixin1-{{ hash }}']
```

Inserted CSS:

```css
.Button-{{ hash }} {
  color: black;
  background: white;
}

.PrimaryButton-{{ hash }} {
  color: black;
  background: white;
}

.AnonMixin1-{{ hash }}.Button-{{ hash }} {
  font-size: 12px;
}
```

#### rule.wrapWith

Wrap current rule with another selector.

```js
import rule from 'rockey';

const css = rule`
  Button {
    color: black;
  }
`;

css.wrapWith('Layer');

const classList = css.getClassList();
const className = classList.Layer
// ['Layer-{{ hash }}']
```

Inserted CSS:

```css
.Layer-{{ hash }} .Button-{{ hash }} {
  color: black;
}
```

#### rule.addMixins

> NOTE: this method is mostly used in internal rockey infrastructure and for integrations with
other libraries. Try not to use it in applications.

Api to add mixins. After this *addMixins()* rule should be wrapped with *wrapWith()*

```js
import rule from 'rockey';

const css = rule`
  color: black;
`;

css.addMixins([
  props => props.small && `font-size: 12px;`
]);

css.wrapWith('Button');

const classList = css.getClassList({
  small: true
});
const className = classList.Button;
// ['.Button-{{ hash }}', 'AnonMixin1-{{ hash }}']
```

#### rule.transform

> NOTE: this method is mostly used in internal rockey infrastructure and for integrations with
other libraries. Try not to use it in applications.

Transform current CSS tree and setup relations between defined components

For example: split rule into multiple rules and make each component to be child of previous component.
This is how rockey-react [looks](https://github.com/tuchk4/rockey/tree/master/packages/rockey-react#looks) feature works.

```js
import rule from 'rockey';

const css = rule`
  Base {
    background: none;

    ${function isSmall(props) {
      return props.small ? `font-size: 12px;` : null
    }}
  }

  Sized {
    font-size: 15px;
  }  

  Colored {
    color: red;
  }
`;

const components = css.transform((tree, create) => {
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

components.Base.getClassList({
  small: true
});
// ['.Base-{{ hash }}', '.Mixin-isSmall-{{ hash }}']

components.Sized.getClassList({
  small: true
});
// ['.Sized-{{ hash }}', '.Base-{{ hash }}', '.Mixin-isSmall-{{ hash }}']

components.Colored.getClassList({
  small: true
});
// ['.Colored-{{ hash }}', '.Sized-{{ hash }}', '.Base-{{ hash }}', '.Mixin-isSmall-{{ hash }}']
```

### when

```js
import when from 'rockey/when';
import { when } from 'rockey';
```

Helps to to keep syntax much better and cleaner when use mixins.
Called each time with *rule.getClassList()*.

```js
import rule from 'rockey';

const css = rule`
  Button {
    color: black;

    ${rockey.when(props => props.primary)`
      color: blue;
    `}

    Icon {
      margin: 5px;
    }
  }
`;

const classList = css.getClassList({
  primary: true
});

const className = classList.Button;
// ['.Button-{{ hash }}', '.AnonMixin1-{{ hash }}']
```

Inserted CSS:

```css
.Button-{{ hash }} {
  color: black;
}

.AnonMixin1-{{ hash }}.Button-{{ hash }} {
  color: blue;
}

.Button-{{ hash }} .Icon-{{ hash }} {
  font-size: 12px;
}
```

To provide more readable mixin class name - define mixin name at first argument.

```js
import rule from 'rockey';

const css = rule`
  Button {
    color: black;

    ${rockey.when('isPrimary', props => props.primary)`
      color: blue;
    `}

    Icon {
      margin: 5px;
    }
  }
`;

const classList = css.getClassList({
  primary: true
});

const className = classList.Button;
// ['.Button-{{ hash }}', '.isPrimary-{{ hash }}']
```

Inserted CSS:

```css
.Button-{{ hash }} {
  color: black;
}

.isPrimary-{{ hash }}.Button-{{ hash }} {
  color: blue;
}

.Button-{{ hash }} .Icon-{{ hash }} {
  font-size: 12px;
}
```

Access to props inside CSS rules:

```js
import rule from 'rockey';

const css = rule`
  Button {
    color: black;

    ${rockey.when(props => props.color)(props => `
      color: ${props.color};
    `)}

    Icon {
      margin: 5px;
    }
  }
`;
```

### condition

```js
import condition from 'rockey/condition';
import { condition } from 'rockey';
```

Same as *when* but it is called only when CSS string is parsing and does not takes *props* at arguments.

```js
import rule from 'rockey';

const css = rule`
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

```js
import { insert } from 'rockey';
import insert from 'rockey/insert';
```

Insert CSS rules to the DOM as is. Without any processing.

```js
import rule from 'rockey';

rule.insert`
  body {
    overflow: hidden;
  }

  #hardcode {
    color: red;
  }

  span.my {
    color: green;
  }
`;
```

## Feedback wanted

This is a very new approach and library and not all features are implemented yet. Feel free to [file issue or suggest feature](https://github.com/tuchk4/rockey/issues/new) to help me to make rockey better.
Or ping me on twitter [@tuchk4](https://twitter.com/tuchk4).

🎉

Upcoming plans:

- Make disadvantages list as shorter as possible
- Medium post *"Rockey Under the Hood"*. Topic about how rockey works — how to make batch CSS rules insert, how to parse and auto optimize parser, how dynamic CSS works
- Medium post *"Rockey — tips and tricks"*. There are too lot of tips and tricks that I want to share with you
- *"Components kit"* — library with easiest way to develop React components using rockey and [recompose](https://github.com/acdlite/recompose)
