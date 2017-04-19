# Rockey

Stressless styles for components using js. Write CSS with functional mixins according to the component structure using components names.

<img src="http://i.imgur.com/ULoeOL4.png" height="16"/> [Medium: CSS in JS. Rockey](https://medium.com/@valeriy.sorokobatko/)

![Rockey tests](https://api.travis-ci.org/tuchk4/rockey.svg?branch=master) ![rockey gzip size](http://img.badgesize.io/https://unpkg.com/rockey@0.0.5-alpha.32af5f74/rockey.min.js?compression=gzip&label=rockey%20gzip)

```bash
npm install --save rockey
```

## Api

- [rule](#rule)
  - [rule.getClassList](#rule.getClassList)
  - [rule.addParent](#rule.addParent)
  - [rule.wrapWith](#rule.wrapWith)
  - [rule.addMixins](#rule.addMixins)
  - [rule.transform](#rule.transform)
- [when](#when)
- [condition](#condition)
- [insert](#insert)


### rule

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

> NOTE: that in most cases developers uses only *getClassList* and *addParent* methods.
Other methods are mostly used in internal rockey infrastructure, for integrations with
other libraries and for new features.

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
.Button-{{ hash }}
  color: black;
}

.Button-{{ hash }} .Icon-{{ hash }} {
  margin: 5px;
}
```

#### rule.addParent

Add parent rule. Child rule classnames will be merged with parent rule classnames.
It is possible to add only one parent.

```js
import rule from 'rockey';

const baseButtonCss = rule`
  Button {
    color: black;
    background: white;

    ${props => props.small ? `font-size: 12px;` : null}
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

primaryButtonCss.PrimaryButton // ['PrimaryButton-{{ hash }}', 'Button-{{ hash }}', 'AnonMixin1-{{ hash }}']
```

Inserted CSS:

```css
.Button-{{ hash }{
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
classList.Layer // ['Layer-{{ hash }}']
```

Inserted CSS:

```css
.Layer-{{ hash }} .Button-{{ hash }} {
  color: black;
}
```

#### rule.addMixins

Api to add mixins. After this *addMixins()* rule should be wrapped with *wrapWith()*

> NOTE: this method is mostly used in internal rockey infrastructure and for integrations with
other libraries. Try not to use it in applications.

```js
import rule from 'rockey';

const css = rule`
  color: black;
`;

css.addMixins([
  props => props.small ? `font-size: 12px;` : null
]);

css.wrapWith('Button');

css.getClassList({
  small: true
});
```

#### rule.transform

Transform current css tree and setup relations between defined components

> NOTE: this method is mostly used in internal rockey infrastructure and for integrations with
other libraries. Try not to use it in applications.

For example: split rule into multiple rules and make each component to be child of previous component.
This is how [rockey-react](https://github.com/tuchk4/rockey/tree/master/packages/rockey-react) *look* feature works.

```js
import rule from 'rockey';

const css = rule`
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

classList.Button; // ['Button-{{ hash }}', 'AnonMixin1-{{ hash }}']
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

classList.Button; // ['Button-{{ hash }}', 'isPrimary-{{ hash }}']
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

Same as *when* but it is called only when CSS string is parsing.

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
Or ping me on twitter @tuchk4.

🎉

Upcoming plans:

- Make disadvantages list as shorter as possible
- Medium post *"Rockey Under the Hood"*. Topic about how rockey works — how to make batch CSS rules insert, how to parse and auto optimize parser, how dynamic CSS works
- Medium post *"Rockey — tips and tricks"*. There are too lot of tips and tricks that I want to share with you
- *"Components kit"* — library with easiest way to develop React components using rockey and [recompose](https://github.com/acdlite/recompose)
