const spawn = require('cross-spawn');

module.exports = function transpile({
  from,
  to,
  args,
  env = {
    NODE_ENV: 'production',
  },
}) {
  spawn.sync('../../node_modules/.bin/babel', ['-d', to, from, ...args], {
    stdio: 'inherit',
    env: Object.assign({}, process.env, env),
  });
};
