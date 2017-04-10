# Rockey <sup>CSS in js</sup>

Stressless styles for components using js. Write CSS with functional mixins according to the component structure using components names.

```bash
npm install --save rockey

# For React applications:
npm install --save rockey-react
```

![Rockey tests](https://api.travis-ci.org/tuchk4/rockey.svg?branch=master)

---

<img src="http://i.imgur.com/ULoeOL4.png" height="16"/> [Rockey at Medium](https://medium.com/@valeriy.sorokobatko/forgekit-785eb17a9b50#.bo3ijxdbm)


## Documentation

- [rockey](https://github.com/tuchk4/rockey/tree/master/packages/rockey) ![rockey gzip size](http://img.badgesize.io/https://unpkg.com/rockey@0.0.5-alpha.32af5f74/rockey.min.js?compression=gzip&label=gzip%20size)
- [rockey-react](https://github.com/tuchk4/rockey/tree/master/packages/rockey-react) ![rockey-react gzip size](http://img.badgesize.io/https://unpkg.com/rockey-react@0.0.8-alpha.32af5f74/rockey-react.min.js?compression=gzip&label=gzip%20size)


## Advantages

### Component based selectors

Write CSS according your components structure. Use real components names for CSS rules instead of classes.

### Readable resulted CSS Class Names

Each generated classname is readable and comprehensible. The same components renders with same class names - it is very useful and сompatible with browser dev tools.

### ~100% CSS Syntax

There is no needs to import specific function to render *@media*, *keyframes*, *font-faces*
or pseudo classes like *:hover* or *::after**.

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

### Fast. And will be More Faster

Rendering CSS string, generating CSS rules and inserting them into DOM is really fast.

There is example of css-in-js ways in React application https://tuchk4.github.io/css-in-js-app/ with examples of different libraries:

- [rockey](https://github.com/tuchk4/rockey)
- [Glamor](https://github.com/threepointone/glamor)
- [Fela](https://github.com/rofrischmann/fela)
- [Aphrodite](https://github.com/Khan/aphrodite)
- [JSS](https://github.com/cssinjs/jss)
- [styled-components](https://github.com/styled-components/styled-components)

Each bundle is lazy initializing (so for better results update page before test to keep initialized only current bundle). Also
there are:

- Timers for rendering 1000 same components and 1000 different components with styles defined in JS.
- Checkbox to switch component `primary` property
- Input to change text
- Links to source code of each bundle

### Framework Agnostic

`rockey` could be used in any application.
There is package of integration rockey with react. Provide a lot of additional features
like - Component look spiting and Handlers mixins.

### Class Name Extending

### Write CSS that Depends on Props

Use functional mixins inside css.

rockey:

```js
import rule from 'rockey';

const rule = rule`
  Button {
    color: red;
    ${props => props.primary ? `color: blue;` : null}
  }
`;

const classList = rule.getClassList();
expect(classList).toEqual({
  Button: "Button-1fed"
});

const primaryClassList = rule.getClassList({
  primary: true
});
expect(primaryClassList).toEqual({
  Button: "Button-1fed AnonMixin1-eefc"
});
```

rockey-react:

```js
import rule from 'rockey-react';

const Button = rockey.button`
  color: red;
  ${props => props.primary ? `color: blue;` : null}
`;

render(<Button>Hello</Button>) // <Button class="AnonButton-1fed">
render(<Button primary={true}>Hello</Button>) // <Button class="AnonButton-1fed AnonMixin1-eefc">
```

*NOTE:* generated class names with *Anon* prefix because Components and mixins names were not defined.

To define name for component name:
```js
const Button = rockey.Button('MuButton');
render(<Button>Hello</Button>) // <Button class="MuButton-1fed">
```

To define name for mixin name use named function:
```js
const Button = rockey.button('MuButton')`
  color: red;
  ${
    function isPrimary(props){
      return props.primary ? `color: blue;` : null
    }
  }
`;

render(<Button primary={true}>Hello</Button>) // <Button class="MuButton-1fed isPrimary-eefc">
```

Or `when` helper:
```js
const Button = rockey.Button('MuButton');
render(<Button>Hello</Button>) // <Button class="MuButton-1fed">
```

To define name for mixin name use named function:
```js
// import when from 'rockey/when';
// or
import { when }  from 'rockey';

const Button = rockey.button('MuButton')`
  color: red;
  ${when('isPrimary', props => props.primary)`
    color: blue;
  `}
`;

render(<Button primary={true}>Hello</Button>) // <Button class="MuButton-1fed isPrimary-eefc">
```


### Uniq Class Names

Each time generate uniq class names with randomly generated hash. Same as [css-modules](https://github.com/css-modules/css-modules).

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

### Small Size

- `rockey` ![rockey gzip size](http://img.badgesize.io/https://unpkg.com/rockey@0.0.5-alpha.32af5f74/rockey.min.js?compression=gzip&label=gzip%20size)
- `rockey-react` ![rockey-react gzip size](http://img.badgesize.io/https://unpkg.com/rockey-react@0.0.8-alpha.32af5f74/rockey-react.min.js?compression=gzip&label=gzip%20size)

`npm run minify` output:

![rockey and rockey-react size](https://monosnap.com/file/1vgaMkwKiYrFjproYTXr1mT3RgkHhT.png)


## Current Disadvantages

- There is no auto-prefixer. Will be added in nearest release. Because styles are generating in realtime
prefixes will be added only for current browser.
- There is no CSS validation. Will be added in nearest release. Will work only if `process.NODE_ENV === 'development'`
- There is not way to remove inserted rules. Will be added a bit later.

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
