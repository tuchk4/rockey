import { argv } from 'yargs';
import chalk from 'chalk';

import getNativeCss from './utils/getCss';
import timer from './utils/timer';
import output from './utils/output';

import css from 'css';

const size = argv.size || 1000;
const CSSString = getNativeCss(size);

console.log('');
console.log(
  `Start ${chalk.green('css')} measuring with ${chalk.cyan(size)} class length`
);
console.log('');

timer(() => {
  const parsed = css.parse(CSSString);
  css.stringify(parsed);
}).then(time => {
  output('css', size, time);
});
