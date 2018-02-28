const path = require('path');
const transpile = require('../../../tasks/common/transpile.js');
const [, , ...args] = process.argv;

transpile({
  from: path.join(__dirname, '..', 'lib'),
  to: path.join(__dirname, '..'),
  args,
});
