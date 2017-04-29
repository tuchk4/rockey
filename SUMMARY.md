# SUMMARY

Medium post <img src="http://i.imgur.com/ULoeOL4.png" height="16"/> [CSS in JS. Rockey](https://medium.com/@tuchk4/css-in-js-rockey-890ebbbd16e7) is too large.
Hard to read it and understand [rockey](https://github.com/tuchk4/rockey) and [rockey-react](https://github.com/tuchk4/rockey-react) features completely.

At this page I will try to collect all distinctive features.

Documenation:
- [rockey](https://github.com/tuchk4/rockey/tree/master/packages/rockey) (*7kb gziped*)
- [rockey-react](https://github.com/tuchk4/rockey/tree/master/packages/rockey-react) (*10kb gziped*)

# Table of contents:

- [Example CSS in JS Application](#example-css-in-js-application)
- [Why do we need CSS in JS?](#why-do-we-need-css-injs)
- [Must see examples](#must-see-examples)
- [What "Component Based" means?](#what-component-based-means)
- [Readable Class Names](#readable-class-names)
- [Small and Fast](#small-and-fast)
- [Flexibility](#flexibility)
- [Dynamic CSS](#dynamic-css)
- [Dynamic CSS - Event Handlers](#dynamic-css---event-handlers)
- [Look](#looks)
- [Recompose Shortcut](#recompose-shortcut)
- [Experimental - Render Cache with Service Workers](#experimental---render-cache-with-service-workers)

## Example CSS in JS Application

#### [tuchk4.github.io/css-in-js-app](https://tuchk4.github.io/css-in-js-app/#/rockey)

There is example React application with implemented different CSS in JS approaches - fela / react-jss / styled-components / styled-jss / glamor  / aphrodite.

# Why do we need CSS in JS?

Firstly, CSS in JS approach is the vanilla JS.

CSS in JS approach — is native JS. You don’t need additional tools to use or build it.

- For components libraries. Or when going to share components between applications.
- More simpler application configuration
- There is no custom loaders
- More cleaner file structure
- Easier to run tests

## Must see examples

- [Button / PrimaryButton / SuccessButton with raised mixin](https://www.webpackbin.com/bins/-Ki2_Te-1y_OiIbQB5bO)
- [Card example](https://www.webpackbin.com/bins/-KfkcTYPzpyglHKfmuKh)
- [Warning Card example](https://www.webpackbin.com/bins/-Ki-AMdS7Q0bzkSyZ81f)
- [Buttons example](https://www.webpackbin.com/bins/-KflMmHbcVU01PD6h43F)
- [Input styles for specific value](https://www.webpackbin.com/bins/-Ki22k9ewZ6gh3Rw87d-)
- [Div background depends on mouse X and Y](https://www.webpackbin.com/bins/-Ki1G10UY-sXlden2XSS)

## What "Component Based" means?

Main goal - keep code as clean as possible.

Write nested CSS according your components structure. Use real components names for CSS rules instead of classes.
Means that if you have component `<Card/>`  — use its name as CSS selector. If you have component `<PrimaryCard/>` — use its name as CSS selector. Use nested selectors according to components structure.

> With [Dynamic CSS](#https://github.com/tuchk4/rockey#dynamic-css) (or even with *rockey-react* - [Dynamic CSS - Event Handlers](#)) You will forgot about large and sometimes very unreadable `classnames` conditions. Just set className at Comopnent's root element.

```html
<Card>
  <CardHeader>
    <Title>I am CardHeader</Title>
    <CloseIcon/>
  </CardHeader>
  <CardBody>I aam Body</CardBody>
  <CardActions>
    <Button>Click me</Button>
  </CardActions>
</Card>
```

```css
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
```

React example:

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

### Readable Class Names

According to example above:

![Generated class names](https://cdn-images-1.medium.com/max/1600/1*Q0qkkBt0xYt0LXjBy-2fzg.png)

### Inserted CSS

Inserted CSS in example above will be

```css
.Card-{{ hash }} {
  width: 100px;
}

.Card-{{ hash }} .CardHeader-{{ hash }} {
  background: #fc3;
}

.Card-{{ hash }} .CardHeader-{{ hash }} .CloseIcon-{{ hash }} {
  float: right;
}

.Card-{{ hash }} .CardBody-{{ hash }} {
  padding: 15px;
}

.Card-{{ hash }} .CardActions-{{ hash }} .Button-{{ hash }} {
  float: right;
}
```

## Small and Fast

- [rockey](https://github.com/tuchk4/rockey/tree/master/packages/rockey) - *7kb gziped*
- [rockey-react](https://github.com/tuchk4/rockey/tree/master/packages/rockey-react) *10kb gziped*

Rendering CSS string, generating CSS rules and inserting them into DOM is really fast.

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

## Flexibility

This refers to [rockey-react](https://github.com/tuchk4/rockey/tree/master/packages/rockey-react).

Rockey Higher Order Component could be used as React component or as function for extending.

```js
import rockey from 'rockey-react';
import Block from 'components/block';

const MyBlock = rockey(Block)`
  background: red;
`;

const PrimaryBlock = MyBlock`
  background: blue;
`;

const LargeBlock = PrimaryButton`
  width: 200px;
`;

const render = () => (
  <Block />
  <MyBlock />
  <PrimaryBlock />
  <LargeBlock />
);
```

Demos:

> NOTE: difference only in generated CSS class names

- [Named Extending: raised Button / PrimaryButton / SuccessButton](https://www.webpackbin.com/bins/-Ki4zp8QqriEj4VSKgvg)
- [Anonymous Extending: raised Button / PrimaryButton / SuccessButton](https://www.webpackbin.com/bins/-Ki0oy6hS3vdQZluouKZ)

### Dynamic CSS

Docs:
- rockey: [when](https://github.com/tuchk4/rockey/tree/master/packages/rockey#when)
- rockey-react: [Dynamic CSS — props](https://github.com/tuchk4/rockey/tree/master/packages/rockey-react#dynamic-css—props)


```css
Button {
  background: white;
  color: black;

  ${function isPrimary(props) {
    return  props.primary && `
      color: blue;
    `
  }}
}
```

> NOTE: To keep syntax more cleaner use helper [when](https://github.com/tuchk4/rockey/tree/master/packages/rockey-react#dynamic-cssprops).

CSS rule is always split into two collections: static and dynamic rules. Example above will be split into:

```css
Button {
  background: white;
  color: black;
}

Mixin-isPrimary {
  color: blue;
}
```

This is one of the reasons why rockey is fast. When props are changed - only dynamic rules will be affected instead of re-calculating of all styles.


Look closely at inserted CSS, especially on how *.Mixin-isPrimary* is declared.
That why no needs to use *!important* - there are no problems with CSS rules priorities.

```css
.Button-{{ hash }} {
  background: white;
  color: black;
}

/* */
.Mixin-isPrimary-{{ hash }}.Button-{{ hash }} {
  color: blue;
}
```

Same approach now is used at [styled-jss](https://github.com/cssinjs/styled-jss). Another CSS in JS libraries re-calculate all styles. For example [styled-components](https://github.com/styled-components/styled-components) will generate two classes with ([demo](https://www.webpackbin.com/bins/-Kee_eVVRWzr06JHcCcQ)):

```css
.{{ hash1 }} {
  background: white;
  color: blue;
}

.{{ hash2 }} {
  background: white;
  color: blue;
  color: blue;
}
```

### Dynamic CSS - Event Handlers

```js
import handler from 'rockey-react/handler';
```

Write CSS mixins that are triggered along with events handlers.

Demos:
- [Input styles for specific value](https://www.webpackbin.com/bins/-Ki22k9ewZ6gh3Rw87d-)
- [Div background depends on mouse X and Y](https://www.webpackbin.com/bins/-Ki1G10UY-sXlden2XSS)

```js
import rockey from 'rockey-react';

const Input = rockey.input`
  font-size: 25px;
  border: none;
  border-bottom: 2px solid #000;
  padding: 0 0 5px 0;
  outline: none;
  font-family: monospace;
  ${rockey.handler('onChange', e => e.target.value === 'rockey')`
    color: green;
  `}
`;
```

### Compitable with Browser DevTools

Demos:
- [Buttons example](https://www.webpackbin.com/bins/-KflMmHbcVU01PD6h43F)
- [Anonymous Buttons example](https://www.webpackbin.com/bins/-Ki-Jk6OoMnFSFshKib6)

> NOTE: Difference in these demos only in generated CSS class names

![git how extends works](https://cdn-images-1.medium.com/max/1600/1*cOu2wXkCq6_m6RPQSkNtsA.gif)

### Looks

Split component into different looks.

Demos:
- [Buttons look](https://www.webpackbin.com/bins/-Ki4mYd1WoxNaYl5pH1I)
- [Card and PrimaryCard look](https://www.webpackbin.com/bins/-KfkcTYPzpyglHKfmuKh)

Most component features could be implemented as component’s prop or as Higher Order Component.

```js
<Button primary={true}>I am Button</Button>
<PrimaryButton>I am PrimaryButton</PrimaryButton>
```

There is the approach that helps to make more correct decision what approach use:

| Button   | raised | disabled  | success | warning | primary | ripple |
| ---------|--------|-----------|---------|---------|---------|--------|   
| raised   |   -    |     ✅    |   ✅    |   ✅    |   ✅      |   ✅    |
| disabled |   ✅   |     -     |   ✅    |   ✅    |   ✅      |   ✅    |
| success  |   ✅   |     ✅     |   -    |   ❌    |   ❌      |    ✅    |
| warning  |   ✅   |     ✅     |   ❌    |   -    |   ❌      |   ✅    |
| primary  |   ✅   |     ✅     |   ❌    |   ❌    |  -       |    ✅    |
| ripple   |   ✅   |     ✅     |   ✅    |   ✅    |   ✅      |   -    |

- *ripple* - could be used in any state. So it should be used as prop.
- *disabled* - could be used in any state. So it should be used as prop.
- *success* - could **NOT*** be used along with *warning* and *primary*. So it should be implemented as Higher Order Component.
- and so on.

If there is no ❌ — feature should be implemented as props. If there is a least one ❌ — feature should be implemented as Higher Order Component.

> NOTE: It also very depends on you and on your team :) Just use what you like best.

According to this table we get these components:

```html
<Button disabled ripple raised>
   I am Button
</Button>

<SuccessButton disabled ripple raised>
  I am Button
</SuccessButton>

<WarningButton disabled ripple raised>
  I am Button
</WarningButton>

<PrimaryButton disabled ripple raised>
  I am Button
</PrimaryButton>
```

And rockey *look* feature helps with this.

**Use look helper:**

```js
import look from 'rockey-react/look';

const { Button, PrimaryButton, SuccessButton } = look.button`
  Button {
    padding: 5px;
    background: none;
  }

  PrimaryButton {
    color: blue;
  }

  SuccessButton {
    color: green;
  }
`;

const render = () => (
  <Button>
  <PrimaryButton>
  <SuccessButton>
);
```

**Use Rockey HOC static method:**

```js
import rockey from 'rockey-react';

const Button = rockey.button`
  padding: 5px;
  background: none;
`;

const { PrimaryButton, SuccessButton } = Button.look`
  PrimaryButton {
    color: blue;
  }

  SuccessButton {
    color: green;
  }
`;

const render () => (
  <Button />

  <PrimaryButton />
  <Button.PrimaryButton />

  <SuccessButton>
  <Button.SuccessButton />
);
```

### Recompose shortcut

```js
import recompose from 'rockey-react/recompose';
```

Currently we use recompose in each React application. Recompose helps to write less code and share features between components. This shortcut helps to save time and code when using rockey + recompose. 
Great thanks to Andrew Clark for [recompose](https://github.com/acdlite/recompose)!

```js
import rockempose from 'rockey-react/recompose';
import withProps from 'recompose/withProps';

const Line = rockempose.span(
  withProps(props => ({
    long: props.value && props.value.length > 140
  }))
)`
  font-size: 15px;

  ${when(props => props.long)`
    font-size: 10px;
  `}
`;
```

## Experimental - Render Cache with Service Workers

Idea is to cache rendered CSS rules at Service Worker after application was initialized. After page reload — CSS link will be inserted:

```html
<link rel="stylesheet" href="/rockey.css?v1" />
```

And Service Worker will catch this request and return cached styles.

*Why Service Worker? Why not LocalStorage or IndexedDB?*

Because when *rockey* will support Server Side Rendering — CSS files could be generated at server and then just applied at client.

## Current Disadvantages

This is a very new and young library and not all features are implemented yet.
But with each new release this list will be much and much shorter until there are no disadvantages :)

- Does not support Server Rendering. Will be added in nearest release.
- There is no auto-prefixer. Will be added in nearest release. Because styles are generating in realtime
prefixes will be added only for current browser.
- There is no CSS validation. Will be added in nearest release. Will work only if `process.NODE_ENV === 'development'`
- There is not way to remove inserted rules. Will be added a bit later.
- Does not support hot-reload. Will be added a bit later.
- Does not delete unused styles from DOM. Will be added a bit later.


## Contribute

Most interested scripts:

- `npm run optimize-parse` to auto optimize CSS parser *packages/rockey/css/parse.js*
- `npm run best-results -- --size {{ SIZE }} ` to run performance tests. `{{ SIZE }}` - number of CSS classes to parse (1000 by default). It run same test for `parse`, `parseOptimized`, [`postcss`](https://github.com/postcss/postcss) and [`postcss safe parser`](postcss-safe-parser) with [`postcss nested plugin`](https://github.com/postcss/postcss-nested). There is file `packages/rockey/tasks/bestResults.json` with best parse results.

## Feedback wanted

This is a very new approach and library and not all features are implemented yet. Feel free to [file issue or suggest feature](https://github.com/tuchk4/rockey/issues/new) to help me to make rockey better.
Or ping me on twitter [@tuchk4](https://twitter.com/tuchk4).

🎉

Upcoming plans:

- Make disadvantages list as shorter as possible
- Medium post *"Rockey Under the Hood"*. Topic about how rockey works — how to make batch CSS rules insert, how to parse and auto optimize parser, how dynamic CSS works
- Medium post *"Rockey — tips and tricks"*. There are too lot of tips and tricks that I want to share with you
- *"Components kit"* — library with easiest way to develop React components using rockey and [recompose](https://github.com/acdlite/recompose)
