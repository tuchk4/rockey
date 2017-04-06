const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const rockey = require('../packages/rockey/package.json');
const rockeyRecat = require('../packages/rockey-react/package.json');

console.log('');

console.log(chalk.green('rockey:'));
rockey.files.forEach(file => {
  const filePath = path.resolve('packages', 'rockey', file);
  const printPath = `packages/rockey-react/${file}`;

  if (!fs.existsSync(filePath)) {
    console.log(`  - ${chalk.red(printPath)}`);
  } else {
    console.log(`  - ${printPath}`);
  }

  rimraf.sync(filePath);
});
console.log('');

console.log(chalk.green('rockey-react:'));
rockeyRecat.files.forEach(file => {
  const filePath = path.resolve('packages', 'rockey-react', file);
  const printPath = `packages/rockey-react/${file}`;

  if (!fs.existsSync(filePath)) {
    console.log(`  - ${chalk.red(printPath)}`);
  } else {
    console.log(`  - ${printPath}`);
  }

  rimraf.sync(filePath);
});
