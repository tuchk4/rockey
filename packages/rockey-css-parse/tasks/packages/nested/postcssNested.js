import { argv } from 'yargs';
import chalk from 'chalk';

import getCss from './utils/getCss';
import timer from './utils/timer';
import output from './utils/output';

import postcss from 'postcss';
import postcssNested from 'postcss-nested';

const size = argv.size || 10;
const css = getCss(size);

console.log('');
console.log(
  `Start ${chalk.green('postcssNested')} measuring with ${chalk.cyan(size)} class length`
);
console.log('');

timer(() => {
  return postcss([postcssNested]).process(css).then(result => {});
}).then(time => {
  output('postcssNested', size, time);
});
