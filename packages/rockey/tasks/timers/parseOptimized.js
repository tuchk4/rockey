import { argv } from 'yargs';
import chalk from 'chalk';

import getCss from './utils/getCss';
import timer from './utils/timer';
import output from './utils/output';

import parseOptimized from '../../lib/css/parseOptimized';
import { stringifyRules } from '../../lib/styleSheets/utils/stringify';

const size = argv.size || 10;
const css = getCss(size);

console.log('');
console.log(
  `Start ${chalk.green('parseOptimized')} measuring with ${chalk.cyan(size)} class length`
);
console.log('');

timer(() => {
  stringifyRules(parseOptimized(css).precss);
}).then(time => {
  output('parseOptimized', size, time);
});
