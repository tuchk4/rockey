const chalk = require('chalk');

const path = require('path');
const spawn = require('cross-spawn');

module.exports = function spawnDev({
  packages,
  command,
  args,
  sync = false,
  env = {
    NODE_ENV: 'production',
  },
}) {
  packages.forEach(name => {
    console.log(`${command}: ${args.join(' ')}: ${chalk.green(name)}`);

    let f = sync ? spawn.sync : spawn;

    f(command, args, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..', '..', 'packages', name),
      env: Object.assign({}, process.env, env),
    });
  });
};
