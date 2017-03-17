const fs = require('fs')
const chalk = require('chalk');
const { argv } = require('yargs');

const spawn = require('cross-spawn');

const spawnDev = package => {
  spawn.sync('node', [`./tasks/buildMinified.js`, '--package', package], {
    stdio: 'inherit',
    env: Object.assign({}, process.env, {
      NODE_ENV: 'production'
    })
  });
}

spawnDev('rockey');
spawnDev('rockey-react');
