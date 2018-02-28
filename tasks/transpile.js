const spawnDev = require('./utils/spawnDev');

spawnDev({
  packages: ['rockey', 'rockey-react', 'rockey-css-parse', 'benchmarks'],
  command: 'npm',
  args: ['run', 'transpile'],
});
