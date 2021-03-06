import { argv } from 'yargs';
import chalk from 'chalk';

import getCss from './utils/getCss';
import timer from './utils/timer';
import output from './utils/output';

import createParser from '../../../lib/parseOptimized';
import stringify from '../../../lib/stringify';

const size = argv.size || 10;
const css = getCss(size);

console.log('');
console.log(
  `Start ${chalk.green('parseOptimized')} measuring with ${chalk.cyan(size)} class length`
);
console.log('');

const parse = createParser();

timer(() => {
  stringify(parse(css).precss);
}).then(time => {
  output('parseOptimized', size, time);
});
