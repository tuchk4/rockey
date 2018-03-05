const spawn = require('cross-spawn');
const chalk = require('chalk');

module.exports = function transpile({
  from,
  to,
  args,
  env = {
    NODE_ENV: 'production',
  },
}) {
  const result = spawn.sync(
    '../../node_modules/.bin/babel',
    ['-d', to, from, ...args],
    {
      stdio: 'inherit',
      env: Object.assign({}, process.env, env),
    }
  );

  if (result.error) {
    console.log(chalk.red(result.error.message));
  }
};
