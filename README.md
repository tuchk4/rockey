# Rockey <sup>CSS in js</sup>

Stressless styles for components using js. Write CSS with functional mixins according to the component structure using components names.

```bash
npm install --save rockey

# For React applications:
npm install --save rockey-react
```

![Rockey tests](https://api.travis-ci.org/tuchk4/rockey.svg?branch=master) ![rockey gzip size](http://img.badgesize.io/https://unpkg.com/rockey@0.0.5-alpha.32af5f74/rockey.min.js?compression=gzip&label=rockey%20gzip) ![rockey-react gzip size](http://img.badgesize.io/https://unpkg.com/rockey-react@0.0.8-alpha.32af5f74/rockey-react.min.js?compression=gzip&label=rockey%20react%20gzip)

---

<img src="http://i.imgur.com/ULoeOL4.png" height="16"/> [Rockey at Medium](https://medium.com/@valeriy.sorokobatko/forgekit-785eb17a9b50#.bo3ijxdbm)

## Documentation

- [rockey](https://github.com/tuchk4/rockey/tree/master/packages/rockey)
- [rockey-react](https://github.com/tuchk4/rockey/tree/master/packages/rockey-react)


## Advantages

### Component based selectors

Write CSS according your components structure. Use real components names for CSS rules instead of classes.

### Readable resulted CSS Class Names

Each generated classname is readable and comprehensible. The same components renders with same class names - it is very useful and сompatible with browser dev tools.

### ~100% CSS Syntax

There is no needs to import specific function to render *@media*, *keyframes*, *font-faces*
or pseudo classes like *:hover* or *::after*.

Support nested and multiple selectors.

```css
Card {
  CardHeader, CardFooter {
    padding: 15px;
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

### Framework Agnostic

`rockey` could be used in any application.

```js
import rockey from 'rockey';

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

- [`rockey-react`](https://github.com/tuchk4/rockey/tree/master/packages/rockey-react) - example of integration with React. Provide a lot of additional features like - Split Component into different looks and Handlers mixins (mixins that depends on events like *onChange*, *onMouseMove* etc).

### Fast. And Will be More Faster!

Rendering CSS string, generating CSS rules and inserting them into DOM is really fast.

#### [tuchk4.github.io/css-in-js-app](https://tuchk4.github.io/css-in-js-app)

There is React application with implemented different css-in-js ways:

- [rockey](https://github.com/tuchk4/rockey)
- [Glamor](https://github.com/threepointone/glamor)
- [Fela](https://github.com/rofrischmann/fela)
- [Aphrodite](https://github.com/Khan/aphrodite)
- [JSS](https://github.com/cssinjs/jss)
- [styled-components](https://github.com/styled-components/styled-components)

Each bundle is lazy initializing (so for better results update page before test to keep initialized only current bundle). Also
there are:

- Timers for rendering 1000 same components and 1000 different components with styles defined in JS.
- Checkbox to switch `primary` property
- Input to change text
- Links to source code of each bundle

### Class Name Extending

Each rule is composed of current styles and all parents. But all CSS rules does not merged into one
class. Instead used multiple classes. Thats why extending works correctly - when change CSS values of parent class via devtools - it will be applied for all children.

### Write CSS that Depends on Props

Wrap CSS code with functions that takes props as arguments and return CSS. Support nested selectors, pseudo classes and all other features expect - other mixins.

To keep syntax much better use *when* function.

Rockey example:
```js
import rockey, { when } from 'rockey';

const rule = rockey`
  Button {
    color: red;
    ${when(props => props.primary)`
      color: blue;
    `}
  }
`;

rule.getClassList({
  primary: true
});
```

Rockey React example:
```js
import rockey from 'rockey-react';

const Button = rockey.button`
  color: red;
  ${rockey.when(props => props.primary)`
    color: blue;
  `}
`;

<Button primary={true}>Yo</Button>
```

### Uniq Class Names

Each time generate uniq class names with randomly generated hash. Same as [css-modules](https://github.com/css-modules/css-modules).

### Nested Selectors

### Small Size

- `rockey` ![rockey gzip size](http://img.badgesize.io/https://unpkg.com/rockey@0.0.5-alpha.32af5f74/rockey.min.js?compression=gzip&label=gzip%20size)
- `rockey-react` ![rockey-react gzip size](http://img.badgesize.io/https://unpkg.com/rockey-react@0.0.8-alpha.32af5f74/rockey-react.min.js?compression=gzip&label=gzip%20size)

`npm run minify` output:

![rockey and rockey-react size](https://monosnap.com/file/1vgaMkwKiYrFjproYTXr1mT3RgkHhT.png)


## Current Disadvantages

This is a very new and young library and not all features are implemented yet.
But with each new release this list will be much and much shorter until there are no disadvantages :)

- There is no auto-prefixer. Will be added in nearest release. Because styles are generating in realtime
prefixes will be added only for current browser.
- There is no CSS validation. Will be added in nearest release. Will work only if `process.NODE_ENV === 'development'`
- There is not way to remove inserted rules. Will be added a bit later.
- Does not support hot-reload.  Will be added a bit later.

## Contribute

After clone:
- `npm install` - install dev dependencies
- `lerna bootstrap`  - install dependencies for all packages

If you want to run rockey inside another applicaiton via *npm link* - run `npm run dev` at rockey to start watchers and transpile code.

- `npm run minify` to minify code
- `npm run optimize-parse` to auto optimize CSS parser *packages/rockey/css/parse.js*
- `npm run best-results -- --size {{ SIZE }} ` to run performance tests. `{{ SIZE }}` - number of CSS classes to parse (1000 by default). It run same test for `parse`, `parseOptimized`, [`postcss`](https://github.com/postcss/postcss) and [`postcss safe parser`](postcss-safe-parser) with [`postcss nested plugin`](https://github.com/postcss/postcss-nested). There is file `packages/rockey/tasks/bestResults.json` with best parse results.
- `npm run clean` - to remove all transpiled files
- `npm run test` - run tests
- `npm run test-dev` - run tests with watchers
- `lerna run prepublish` - to transpile all packages.

There is precommit hook (via [husky](http://npmjs.com/package/husky)) to run [prettier](prettier) for all staged files.
