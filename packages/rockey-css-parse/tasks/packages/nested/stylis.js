import { argv } from 'yargs';
import chalk from 'chalk';

import getCss from './utils/getCss';
import timer from './utils/timer';
import output from './utils/output';

import stylis from 'stylis';

const size = argv.size || 10;
const css = getCss(size);

console.log('');
console.log(
  `Start ${chalk.green('stylis')} measuring with ${chalk.cyan(size)} class length`
);
console.log('');

timer(() => {
  stylis('', css);
}).then(time => {
  output('stylis', size, time);
});
