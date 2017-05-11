import { argv } from 'yargs';
import chalk from 'chalk';

import getNativeCss from './utils/getCss';
import timer from './utils/timer';
import output from './utils/output';

import postcss from 'postcss';

const size = argv.size || 1000;
const css = getNativeCss(size);

console.log('');
console.log(
  `Start ${chalk.green('postcss')} measuring with ${chalk.cyan(size)} class length`
);
console.log('');

timer(() => {
  return postcss().process(css).then(result => {});
}).then(time => {
  output('postcss', size, time);
});
