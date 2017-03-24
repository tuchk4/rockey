/**
 * Moved from npm prepublish command due to Windows issues
 * original command was:
 * // ../../node_modules/.bin/cross-env NODE_ENV=production ../../node_modules/.bin/babel -d ./ ./lib
 */
const spawn = require('cross-spawn');

const [node, path, ...args] = process.argv;

spawn.sync('../../node_modules/.bin/babel', ['-d', './', './lib', ...args], {
  stdio: 'inherit',
  env: Object.assign({}, process.env, {
    NODE_ENV: 'production'
  })
});
