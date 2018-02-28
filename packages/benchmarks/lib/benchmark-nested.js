import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import spawn from 'cross-spawn';
import { argv } from 'yargs';

const bestResultsPath = path.join(
  __dirname,
  'bestResults',
  'results-nested.json'
);

const currentResultsPath = path.join(__dirname, 'results-nested.json');

fs.writeFileSync(currentResultsPath, JSON.stringify({}));

const size = argv.size || 1000;
const filter = argv.filter ? argv.filter.split(',') : null;

const prevBestResults = JSON.parse(fs.readFileSync(bestResultsPath).toString());
const prevBestSizeTimings = prevBestResults[size];
let prevBestSorted = [];

if (prevBestSizeTimings) {
  prevBestSorted = Object.keys(prevBestSizeTimings).sort((a, b) => {
    return prevBestSizeTimings[a] - prevBestSizeTimings[b];
  });
}

const modules = ['rockey', 'stylis', 'postcss', 'postcssSafe'];

console.log('');
console.log('Benchmark nested');

modules.filter(m => !filter || filter.indexOf(m.trim()) !== -1).forEach(m => {
  spawn.sync(
    'node',
    [
      path.join(__dirname, 'run.js'),
      '--mode',
      'nested',
      '--lib',
      m,
      '--size',
      argv.size || 1000,
      '--skip-summary',
    ],
    {
      stdio: 'inherit',
    }
  );
});

console.log('');
console.log('Current results:');

const currentResults = JSON.parse(
  fs.readFileSync(currentResultsPath).toString()
);

Object.keys(currentResults)
  .sort((a, b) => {
    return currentResults[a] - currentResults[b];
  })
  .forEach((key, i) => {
    console.log(
      `   ${chalk.green(i + 1)}  ${chalk.cyan(key)} - ${currentResults[key]}sec`
    );
  });

const bestResults = JSON.parse(fs.readFileSync(bestResultsPath).toString());
const bestSizeTimings = bestResults[size];

if (bestSizeTimings) {
  console.log('');
  console.log('Best results:');

  Object.keys(bestSizeTimings)
    .sort((a, b) => {
      return bestSizeTimings[a] - bestSizeTimings[b];
    })
    .forEach((key, i) => {
      let diff = 0;
      if (prevBestSorted[i] && prevBestSorted[i] !== key) {
        const delta = prevBestSorted.indexOf(key) - i;

        diff =
          delta > 0
            ? chalk.green(`(+${Math.abs(delta)})`)
            : chalk.red(`(-${Math.abs(delta)})`);
      }

      console.log(
        `   ${chalk.green(i + 1)} ${diff ? diff : ''} ${chalk.cyan(
          key
        )} - ${bestSizeTimings[key]}sec`
      );
    });
}
