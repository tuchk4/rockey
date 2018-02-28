import path from 'path';
import { argv } from 'yargs';
import chalk from 'chalk';
import output from './utils/output';
import timer from './utils/timer';
import { getCSS, getNestedCSS, getNativeAsArrayCSS } from './utils/getCSS';

const bench = require(`./${argv.mode}/${argv.lib}`).default;

const bestResultsPath = path.join(
  __dirname,
  'bestResults',
  `results-${argv.mode}.json`
);

const currentResultsPath = path.join(__dirname, `results-${argv.mode}.json`);

const logOutput = output({
  bestResultsPath,
  currentResultsPath,
});

console.log('');
console.log(
  `Start ${chalk.green(argv.lib)} measuring with ${chalk.cyan(
    argv.size
  )} class length`
);
console.log('');

let css = '';

switch (argv.mode) {
  case 'native':
    css = getCSS(argv.size);
    break;
  case 'nativeAsArray':
    css = getNativeAsArrayCSS(argv.size);
    break;
  case 'nested':
    css = getNestedCSS(argv.size);
    break;
  default:
    throw new Error('wrong run mode');
}

bench({
  css,
  timer,
})
  .then(time => {
    logOutput(argv.lib, argv.size, time);
  })
  .catch(e => {
    console.log('');
    console.log(`Error at ${chalk.red(argv.lib)}`);
    console.log(e.message);
    console.log('');
  });
