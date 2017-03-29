const spawn = require('cross-spawn');

const spawnDev = packageName => {
  spawn.sync('node', [`./tasks/buildMinified.js`, '--package', packageName], {
    stdio: 'inherit',
    env: Object.assign({}, process.env, {
      NODE_ENV: 'production',
    }),
  });
};

spawnDev('rockey');
spawnDev('rockey-react');
