const chalk = require('chalk');

const spawn = require('cross-spawn');

const spawnDev = packageName => {
  console.log(`dev: ${chalk.green(packageName)}`);

  spawn('npm', ['run', 'transpile'], {
    stdio: 'inherit',
    cwd: __dirname + `/../packages/${packageName}`,
    env: Object.assign({}, process.env, {
      NODE_ENV: 'production',
    }),
  });
};

spawnDev('rockey');
spawnDev('rockey-react');
spawnDev('rockey-css-parse');
