const rimraf = require('rimraf');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

module.exports = function({ base, name, files }) {
  console.log('');
  console.log(chalk.green(name));

  files.forEach(file => {
    const filePath = path.resolve(base, file);

    const printPath = path.relative(path.join(__dirname, '..', '..'), filePath);

    if (fs.existsSync(filePath)) {
      rimraf.sync(filePath);
      console.log(`  - ${printPath}`);
    } else {
      console.log(`  - ${chalk.red(printPath)}`);
    }
  });

  console.log('');
};
