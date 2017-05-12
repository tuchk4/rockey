# Rockey CSS Parse

Very fast function to parse dynamic CSS (with JS functions inside) and generate CSS string according to props. And very small (**~5kb** gzipped).

<img src="http://i.imgur.com/ULoeOL4.png" height="16"/> [CSS in JS. Rockey](https://medium.com/@tuchk4/css-in-js-rockey-890ebbbd16e7)

```bash
npm install --save rockey-css-parse
```

![Rockey tests](https://api.travis-ci.org/tuchk4/rockey.svg?branch=master) ![rockey-css-parse gzip size](http://img.badgesize.io/https://unpkg.com/rockey-css-parse@0.0.12/rockey-react.min.js?compression=gzip&label=rockey%20css%20parse%20gzip)

# Table of contents:

- [Perfomance](#perfomance)
- [Parse Usage](#parse-usage)
  - [parse()](#parse)
  - [plugins](#plugins)
- [Stringify](#stringify)
- [Example](#example)
- [Contribute](#contribute)
- [Feedback wanted](#feedback-wanted)


## Perfomance

`rockey-css-parse` is very fast but note that it does not generate AST tree. rockey uses another easy format for fast CSS generating with dynamic CSS supporting.

Used libraries in benchmark:

- [rockey-css-parse](https://github.com/tuchk4/rockey/tree/master/packages/rockey-css-parse)
- [css](https://github.com/reworkcss/css)
- [postcss](https://github.com/postcss/postcss) with [Nested Plugin](https://github.com/postcss/postcss-nested). For *bench:nested* uses [Nested Plugin](https://github.com/postcss/postcss-nested).
- [postcss safe parser](https://github.com/postcss/postcss-safe-parser). For *bench:nested* uses [Nested Plugin](https://github.com/postcss/postcss-nested).
- [stylis](https://github.com/thysultan/stylis.js)

To run benchmarks for CSS with nested selector:
```
npm run bench:nested -- --size=10000
```

To run benchmarks for native CSS string:
```
npm run bench:native -- --size=10000
```

#### results

NOTE that benchmarks is not 100% correct because each lib was developed for different goals.
And there are very different libs features.

**Nested** CSS syntax for 1000 blocks ([screenshot nested 1000](http://i.imgur.com/ZAUwtRP.png)):

- rockey parseOptimize - *0.521* sec
- rockey parse - *0.771* sec
- postcssNested - *1.7* sec
- postcssNestedSafeParser - *1.961* sec
- stylis - *8.68* sec

**Nested** CSS syntax for 10000 blocks ([screenshot nested 10000](http://i.imgur.com/Drk2BDM.png)):

- rockey parseOptimize - *4.949* sec
- rockey parse - *7.154* sec
- postcssNested - *19.251* sec
- postcssNestedSafeParser - *22.169* sec
- stylis - failed

**Native** CSS syntax for 1000 blocks ([screenshot native 1000](http://i.imgur.com/VPd0yqp.png)):

- rockey parseOptimize - *0.402* sec
- postcssSafeParser - *0.439* sec
- postcss - *0.452* sec
- rockey parse - *0.504* sec
- stylis - *0.568* sec
- css - *0.504* sec

**Native** CSS syntax for 10000 blocks ([screenshot native 10000](http://i.imgur.com/5hKoDbt.png)):

- stylis - *1.88* sec
- rockey parseOptimize - *3.586* sec
- postcssSafeParser - *3.622* sec
- postcss - *3.831* sec
- css - *4.674* sec
- rockey parse - *4.927* sec


## Parse Usage

```js
import hash from 'rockey-css-parse/utils/hash';
import createParser from 'rockey-css-parse';

const parse = createParser({
  getClassName: component => `${component}-${hash()}`,
  getMixinName: mixin => `m-${mixin}`,
  getAnimationName: animation => `a-${animation}`,
  plugins: []
});
```

All config props are optional.

- *`getClassName(component)`* - generate component classname. Takes original component name as first argument. Results are cached per *parse* call - so fell free to use random hashes to make classnames uniq.

- *`getMixinName(mixin)`* - generate mixin classname. Takes original mixin name as first argument

> mixin - is a JS function inside CSS string. Its name - is a function name or function *displayName* attribute and *anon* for anonymous or arrow functions.

- *`getAnimationName(animation)`* - generate animation name. Takes original animation name as first argument
- *`plugins`* - array of plugins

#### parse

```js
import hash from 'rockey-css-parse/utils/hash';
import createParser from 'rockey-css-parse';

const parse = createParser({
  getClassName: component => `${component}-${hash()}`,
});

const { precss, classList } = parse(`
  Button {
    color: red;

    :hover {
      color: green;
    }
  }

  Layer {
    padding: 15px;

    Button {
      color: purple;

      :hover {
        color: red;
      }

      @media (max-width: 699px) {
        color: blue;
      }
    }
  }
`);

expect(classList.Button).toEqual('Button-abc4');
expect(classList.Layer).toEqual(('Layer-ccf9');


expect(precss).toEqual([{
  selector: '.Button-abc4',
  styles: {
    color: 'red'
  }
}, {
  selector: '.Button-abc4:hover',
  styles: {
    color: 'green'
  }
}, {
  selector: '.Layer-ccf9',
  styles: {
    padding: '15px'
  }
}, {
  selector: '.Layer-ccf9 .Button-abc4',
  styles: {
    color: 'purple'
  }
}, {
  selector: '.Layer-ccf9 .Button-abc4:hover',
  styles: {
    color: 'red'
  }
}, {
  selector: '.Layer-ccf9 .Button-abc4:hover',
  media: '@media (max-width: 699px)',
  styles: {
    color: 'red'
  }
}]);
```

> NOTE: That *precss* is not the AST tree. It is just easy format for fast CSS generating with dynamic CSS supporting.

- *classList* - map of root selector and generated classnames
- *precss* - array of precss objects. Each precss object consist of CSS selector, dynamic CSS functions, styles and root parent components.


#### plugins

Plugin - function that takes styles object, process it and returns it back.

Example of plugin that do `console.warn`  if there are rules with *!important* flag.

```js
function warnIfImportant(styles) {
  Object.keys(styles).forEach(prop => {
    const isImportant = styles[prop].indexOf('!important') !== -1;
    if (isImportant) {
      console.warn(
        `(warnIfImportant) rule should not be with !important flag. "${prop}:${styles[prop]}"`
      );
    }
  });

  return styles;
}
```


## Stringify

Stringify without dynmaic rules:

```js
import createParser from 'rockey-css-parse';
import stringify from 'rockey-css-parse/stringify';

const parse = createParser();

const { classList, precss } = parse(`
  Button {
    color: black;
    background-color: #ccc;

    :hover {
      color: purple;
    }
  }`
);

// stringify all precss
const fullCSSContent = stringify(precss);
// stringify only first precss object
const firstCSSSelector = strigify(precss[0]);
```

Stringify with dynamic rules:

```js
import createParser from 'rockey-css-parse';
import stringify from 'rockey-css-parse/stringify';

const parse = createParser();

const { classList, precss } = parse`
  Button {
    color: ${props => props.primary ? 'purple' : 'black'};
    background-color: ${props => props.bgColor};

    ${props => props.primary && `
      :hover {
        color: black;
      }
    `}
  }
`;

const fullCSSContent = stringify(precss, {
  primary: true,
  bgColor: '#ccc'
});
```

## Example

```js
import shader from 'shader';
import createParser from 'rockey-css-parse';

const parse = createParser();

const bgColor = '#f6f6f6';

const { classList, parsed } = parse`
  Button {
    font-size: 20px;
    padding: 5px;
    margin: 5px;
    background: ${bgColor};
    border: 1px solid #ccc;

    ${props => props.raised && `
      box-shadow: 5px 5px 5px rgba(0, 0, 0, .3);
    `}

    Icon {
      margin: 5px;
    }

    :hover {
      background: ${shader(bgColor, -0.03)}
    }
  }

  PrimaryButton {
   color: blue;
  }

  SuccessButton {
   color: green;
  }
`;
```

## Contribute

- `npm run dev` - starts watchers and transpiles code.
- `npm run optimize-parse` to auto optimize CSS parser *packages/rockey-css-parse/parse.js* => *packages/rockey-css-parse/parseOptimized.js*

benchmarks:

For nested CSS syntax:

```
npm run bench:nested -- --size {{ SIZE }}
```

For native CSS syntax:

```
npm run bench:native -- --size {{ SIZE }}
```

*`{{ SIZE }}`* - number of generated CSS classes to parse (1000 by default).

## Feedback wanted

This is a very new approach and library and not all features are implemented yet. Feel free to [file issue or suggest feature](https://github.com/tuchk4/rockey/issues/new) to help me to make rockey better.
Or ping me on twitter [@tuchk4](https://twitter.com/tuchk4).

🎉
