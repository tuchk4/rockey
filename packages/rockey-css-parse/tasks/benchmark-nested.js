import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import spawn from 'cross-spawn';
import { argv } from 'yargs';

const bestResultsPath = path.join(
  __dirname,
  'results',
  'bestResults-nested.json'
);
const currentResultsPath = path.join(__dirname, 'currentResults-nested.json');

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

const modules = [
  'parse',
  'parseOptimized',
  // 'stylis',
  'postcssNested',
  'postcssNestedSafeParser',
];

console.log('');
console.log('Benchmark nested');

modules.filter(m => !filter || filter.indexOf(m.trim()) !== -1).forEach(m => {
  spawn.sync(
    'node_modules/.bin/babel-node',
    [
      `./packages/rockey-css-parse/tasks/packages/nested/${m}.js`,
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

      diff = delta > 0
        ? chalk.green(`(+${Math.abs(delta)})`)
        : chalk.red(`(-${Math.abs(delta)})`);
    }

    console.log(
      `   ${chalk.green(i + 1)} ${diff ? diff : ''} ${chalk.cyan(key)} - ${bestSizeTimings[key]}sec`
    );
  });
