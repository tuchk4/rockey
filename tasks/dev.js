const fs = require('fs')
const chalk = require('chalk');

const spawn = require('cross-spawn')

const spawnDev = package => {

  console.log(`dev: ${chalk.green(package)}`);

  spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    cwd: __dirname + `/../packages/${package}`,
    env: Object.assign({}, process.env, {
      NODE_ENV: 'production'
    })
  });
}

spawnDev('rockey');
spawnDev('rockey-react');
