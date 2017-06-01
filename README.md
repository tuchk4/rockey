# Rockey <sup>Component Based CSS in JS</sup>

Stressless CSS for components using JS. Write Component Based CSS with functional mixins.

- <img src="http://i.imgur.com/ULoeOL4.png" height="16"/> [CSS in JS. Rockey](https://medium.com/@tuchk4/css-in-js-rockey-890ebbbd16e7)
- [SUMMARY](https://github.com/tuchk4/rockey/blob/master/SUMMARY.md) - here I tried to collect all features and differences with other libs.
- [MOTIVATION](https://github.com/tuchk4/rockey/blob/master/MOTIVATION.md)


```bash
npm install --save rockey

# For React applications:
npm install --save rockey-react
```

![Rockey tests](https://api.travis-ci.org/tuchk4/rockey.svg?branch=master)

---

## Documentation

- [rockey](https://github.com/tuchk4/rockey/tree/master/packages/rockey)
- [rockey-css-parse](https://github.com/tuchk4/rockey/tree/master/packages/rockey-css-parse)
- [rockey-react](https://github.com/tuchk4/rockey/tree/master/packages/rockey-react)
- [rockey-css-parse REPL](https://tuchk4.github.io/rockey-css-parse-repl/)


### Why do we need CSS in JS?

Firstly, CSS in JS approach is the vanilla JS. 

CSS in JS approach — is native JS. You don’t need additional tools to use or build it.

- Developer Experience!
- For components libraries. Or when going to share components between applications.
- More simpler application configuration
- There is no custom loaders
- More cleaner file structure
- Easier to run tests
- DRY

More details explained at Medium Post - <img src="http://i.imgur.com/ULoeOL4.png" height="16"/> [CSS in JS. Rockey](https://medium.com/@tuchk4/css-in-js-rockey-890ebbbd16e7)

## Features and Advantages

### Framework Agnostic

Rockey could be used in any application.

### Small Size

- `rockey` ![rockey gzip size](http://img.badgesize.io/https://unpkg.com/rockey@0.0.14/rockey.min.js?compression=gzip&label=gzip%20size)
- `rockey-react` ![rockey-react gzip size](http://img.badgesize.io/https://unpkg.com/rockey-react@0.0.14/rockey-react.min.js?compression=gzip&label=gzip%20size)
- `rockey-css-parse` ![rockey-css-parse gzip size](http://img.badgesize.io/https://unpkg.com/rockey-css-parse@0.0.14/rockey-react.min.js?compression=gzip&label=rockey%20css%20parse%20gzip)

`npm run minify` output:

![rockey and rockey-react size](https://monosnap.com/file/1vgaMkwKiYrFjproYTXr1mT3RgkHhT.png)


### Uniq Class Names

Each time generate uniq class names with randomly generated hash. Same as [css-modules](https://github.com/css-modules/css-modules).

### Component based selectors

Write CSS according your components structure. Use real components names for CSS rules instead of classes.
Means that if you have component Card  — use its name as CSS selector. If you have component PrimaryCard — use its name as CSS selector. Use nested selectors according to components structure.

Live demo: [Card example](https://www.webpackbin.com/bins/-KfkcTYPzpyglHKfmuKh)

### Readable CSS Class Names

Each generated classname is clear and readable. The same components renders with same class names. It is very useful and сompatible with browser dev tools — change styles for one component will always apply changes for the rest of the same components.

![Generated class names](https://cdn-images-1.medium.com/max/1600/1*Q0qkkBt0xYt0LXjBy-2fzg.png)

### ~100% CSS Syntax

```css
Card {
  CardHeader, CardFooter {
    padding: 15px;
  }

  CardBody {
    + Button {
      padding-left: 15px;
    }
  }

  :hover {
    border: 1px solid #000;

    CardHeader {
      background: yellow;
    }
  }  

  CardFooter {
    background: purple;

    @media (max-width: 600px) {
      display: none
    }
  }  
}
```

There is no needs to import specific function to render *@media*, *keyframes*, *font-faces* or pseudo classes like *:hover* or *::after*. Support nested and multiple selectors.

Live demo with complex selectors: [Material TextField](https://www.webpackbin.com/bins/-Ki-KJQAQOJEmTECJUoE)

### Fast. And Will be More Faster!

Rendering CSS string, generating CSS rules and inserting them into DOM is really fast. There is example React application with implemented different approaches: fela / jss / glamor / styled-components / rockey.

- Live: [tuchk4.github.io/css-in-js-app](https://tuchk4.github.io/css-in-js-app/#/)
- Github repo: [github.com/tuchk4/css-in-js-app](https://github.com/tuchk4/css-in-js-app)

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

### Class Names

rockey uses separated CSS classes for each rule and for each mixin. That is why it is very сompatible with devtools. When change CSS values of parent component via devtools — it will be applied for all children.

rockey-react example (works same as [rockey.addParent](https://github.com/tuchk4/rockey/tree/master/packages/rockey#ruleaddparent)):

```js
import rockey from 'rockey-react';

const Button = rockey.button('Button')`
  color: black;

  ${rockey.when('LargeButton', props => props.large)`
    font-size: 20px;
  `}
`;

const PrimaryButton = Button('PrimaryButton')`
  color: blue;
`;

const SuperButton = PrimaryButton('SuperButton')`
  color: red;
`;
```

Inserted CSS (after component is rendered):

```css
.Button-{{ hash }} {
  color: black;
}

.PrimaryButton-{{ hash }} {
  color: blue;
}

.SuperButton-{{ hash }} {
  color: red;
}

.Mixin-LargeButton-{{ hash }}.Button-{{ hash }} {
  font-size: 20px;
}
```

And for `<PrimaryButton large={true}/>` className prop will equal `.PrimaryButton-{{ hash }} .Button-{{ hash }} .Mixin-LargeButton-{{ hash }}`.

That is why it is very сompatible with devtools. When change CSS values of parent component via devtools — it will be applied for all children.

If prop *large* is changed to *false* - only mixin class will be removed instead of all styles re-calculating. This is another reason why rockey is fast.

- Live demo: [Buttons example](https://www.webpackbin.com/bins/-KflMmHbcVU01PD6h43F)
- Demo with anonymous components: [Anonymous Buttons example](https://www.webpackbin.com/bins/-Ki-Jk6OoMnFSFshKib6)

![git how extends works](https://cdn-images-1.medium.com/max/1600/1*cOu2wXkCq6_m6RPQSkNtsA.gif)

### Dynamic CSS

```css
Button {
  color: black;

  ${rockey.when('isPrimary', props => props.primary)`
    color: blue;
  `}

  Icon {
    margin: 5px;
  }
}
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

### Rockey React

Rockey was integrated with React. There are much more feature and advanteags.

- Api documentation - [rockey-react](https://github.com/tuchk4/rockey/tree/master/packages/rockey-react)
- Features:
  - [Flexible Rockey Higher Order Component](https://github.com/tuchk4/rockey/tree/master/packages/rockey-react#flexible-rockey-higher-order-component)
  - [Shortcuts](https://github.com/tuchk4/rockey/tree/master/packages/rockey-react#shortcuts)
  - [Dynamic CSS — props](https://github.com/tuchk4/rockey/tree/master/packages/rockey-react#dynamic-cssprops)
  - [Dynamic CSS — Event Handlers](https://github.com/tuchk4/rockey/tree/master/packages/rockey-react#dynamic-csseventhandlers)
  - [Looks](https://github.com/tuchk4/rockey/tree/master/packages/rockey-react#looks)
  - [Recompose shortcut](https://github.com/tuchk4/rockey/tree/master/packages/rockey-react#recompose-shortcut)

---

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

# Examples

- [Card example](https://www.webpackbin.com/bins/-KfkcTYPzpyglHKfmuKh)
- [Warning Card example](https://www.webpackbin.com/bins/-Ki-AMdS7Q0bzkSyZ81f)
- [Buttons example](https://www.webpackbin.com/bins/-KflMmHbcVU01PD6h43F)
- [Button / PrimaryButton / SuccessButton with raised mixin](https://www.webpackbin.com/bins/-Ki2_Te-1y_OiIbQB5bO)
- [Anonymous Extending: raised Button / PrimaryButton / SuccessButton](https://www.webpackbin.com/bins/-Ki0oy6hS3vdQZluouKZ)
- [Anonymous Buttons example](https://www.webpackbin.com/bins/-Ki-Jk6OoMnFSFshKib6)
- [Material TextField](https://www.webpackbin.com/bins/-Ki-KJQAQOJEmTECJUoE)
- [Primary and Raised Blocks](https://www.webpackbin.com/bins/-KflpZuJTEet-ECpPpWE)
- [Input styles for specific value](https://www.webpackbin.com/bins/-Ki22k9ewZ6gh3Rw87d-)
- [Div background depends on mouse X and Y](https://www.webpackbin.com/bins/-Ki1G10UY-sXlden2XSS)
- [Animated divs](https://www.webpackbin.com/bins/-KflkDbSVrccxSkAAFZq)
- [Themed Buttons](https://www.webpackbin.com/bins/-Kflsy2FIkQy4n27qeLc)

## Contribute

After clone:
- `npm install` - install dev dependencies
- `lerna bootstrap`  - install dependencies for all packages

If you want to run rockey inside another applicaiton via *npm link* - run `npm run dev` at rockey to start watchers and transpile code.

- `npm run minify` to minify code
- `npm run optimize-parse` to auto optimize CSS parser *packages/rockey-css-parse/parse.js*
- `npm run clean` - to remove all transpiled files
- `npm run test` - run tests
- `npm run test-dev` - run tests with watchers
- `lerna run prepublish` - to transpile all packages.

benchmarks:

For nested CSS syntax:

```
npm run bench:nested -- --size {{ SIZE }}
```

For native CSS syntax:

```
npm run bench:native -- --size {{ SIZE }}
```

- *`{{ SIZE }}`* - number of generated CSS classes to parse (1000 by default).

There is precommit hook (via [husky](http://npmjs.com/package/husky)) to run [prettier](prettier) for all staged files.


## Feedback wanted

This is a very new approach and library and not all features are implemented yet. Feel free to [file issue or suggest feature](https://github.com/tuchk4/rockey/issues/new) to help me to make rockey better.
Or ping me on twitter [@tuchk4](https://twitter.com/tuchk4).

🎉

Upcoming plans:

- Make disadvantages list as shorter as possible
- Medium post *"Rockey Under the Hood"*. Topic about how rockey works — how to make batch CSS rules insert, how to parse and auto optimize parser, how dynamic CSS works
- Medium post *"Rockey — tips and tricks"*. There are too lot of tips and tricks that I want to share with you
- *"Components kit"* — library with easiest way to develop React components using rockey and [recompose](https://github.com/acdlite/recompose)
