import fs from 'fs';
import chalk from 'chalk';
import { argv } from 'yargs';

export default function logOutout({ bestResultsPath, currentResultsPath }) {
  const output = (id, size, time) => {
    const bestResults = require(bestResultsPath);
    let bestSizeTimings = bestResults[size];

    if (!bestSizeTimings) {
      bestSizeTimings = {};
    }

    let prevBestSorted = [];
    if (bestSizeTimings) {
      prevBestSorted = Object.keys(bestSizeTimings).sort((a, b) => {
        return bestSizeTimings[a] - bestSizeTimings[b];
      });
    }

    let details = '';

    if (bestSizeTimings[id]) {
      if (bestSizeTimings[id] > time) {
        const presentage = Math.abs(100 - 100 * bestSizeTimings[id] / time);
        details = `${chalk.green(
          `+${Math.round(presentage).toFixed(2)}%`
        )} ${chalk.grey(`(${bestSizeTimings[id]}sec)`)}`;

        bestSizeTimings[id] = time;
      } else {
        const presentage = Math.abs(100 - 100 * time / bestSizeTimings[id]);
        details = `${chalk.red(
          `-${Math.round(presentage).toFixed(2)}%`
        )} ${chalk.grey(`(${bestSizeTimings[id]}sec)`)}`;
      }
    } else {
      bestSizeTimings[id] = time;
    }

    console.log(`   ${chalk.cyan(id)} - ${time}sec ${details}`);
    console.log('');

    if (!argv.skipSummary) {
      console.log('');
      console.log('Best results:');
      console.log('');

      const bestSorted = Object.keys(bestSizeTimings).sort((a, b) => {
        return bestSizeTimings[a] - bestSizeTimings[b];
      });
      bestSorted.forEach((key, i) => {
        let diff = 0;

        if (
          bestSorted.length === prevBestSorted.length &&
          bestSorted[i] &&
          bestSorted[i] !== key
        ) {
          const delta = bestSorted.indexOf(key) - i;

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

    let currentResults = {};
    if (fs.existsSync(currentResultsPath)) {
      currentResults = JSON.parse(
        fs.readFileSync(currentResultsPath).toString()
      );
    }

    fs.writeFileSync(
      currentResultsPath,
      JSON.stringify(
        Object.assign({}, currentResults, {
          [id]: time,
        }),
        2,
        2
      )
    );

    fs.writeFileSync(
      bestResultsPath,
      JSON.stringify(
        Object.assign({}, bestResults, {
          [size]: bestSizeTimings,
        }),
        2,
        2
      )
    );
  };

  return output;
}
