import { argv } from 'yargs';
import chalk from 'chalk';

import getCss from './utils/getCss';
import timer from './utils/timer';
import output from './utils/output';

import cssToObject from 'css-to-object';

const size = argv.size || 10;
const css = getCss(size);

console.log('');
console.log(
  `Start ${chalk.green('css-to-object')} measuring with ${chalk.cyan(size)} class length`
);
console.log('');

timer(() => {
  cssToObject(css);
}).then(time => {
  output('css-to-object', size, time);
});
