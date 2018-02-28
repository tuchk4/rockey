const path = require('path');
const clean = require('../../../tasks/common/clean.js');

clean({
  files: require('../package.json').files,
  name: require('../package.json').name,
  base: path.resolve(__dirname, '..'),
});
