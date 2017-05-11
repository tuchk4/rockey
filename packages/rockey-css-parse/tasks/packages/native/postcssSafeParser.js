import { argv } from 'yargs';
import chalk from 'chalk';

import getNativeCss from './utils/getCss';
import timer from './utils/timer';
import output from './utils/output';

import postcss from 'postcss';
import postcssSafeParser from 'postcss-safe-parser';

const size = argv.size || 1000;
const css = getNativeCss(size);

console.log('');
console.log(
  `Start ${chalk.green('postcssNestedSafeParser')} measuring with ${chalk.cyan(size)} class length`
);
console.log('');

timer(() => {
  return postcss()
    .process(css, {
      parser: postcssSafeParser,
    })
    .then(result => {});
}).then(time => {
  output('postcssNestedSafeParser', size, time);
});
