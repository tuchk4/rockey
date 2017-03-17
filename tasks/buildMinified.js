const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const toCamelCase = require('lodash/camelCase');
const webpack = require('webpack');
const prettyBytes = require('pretty-bytes');
const gzipSize = require('gzip-size');

const { argv } = require('yargs');

const package = argv.package;
const allowed = ['rockey', 'rockey-react'];

if (allowed.indexOf(package) === -1) {
  throw new Error(`package "${package}" is not allowed`);
}

const FILE_NAME = `${package}.min.js`;

const compiler = webpack({
  context: path.resolve(__dirname, '..', 'packages', package),

  entry: './index.js',

  output: {
    path: path.resolve(__dirname, '..', 'packages', package),
    filename: FILE_NAME,
    library: toCamelCase(package),
    libraryTarget: 'umd'
  },

  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    }
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: false,
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
  ]
});

console.log('');
console.log(`   Minify: ${chalk.cyan(package)}`);
console.log('');

compiler.run((err, stats) => {
  if (err || stats.hasErrors()) {
    console.log(err);
  } else {
    const size = gzipSize.sync(
      fs.readFileSync(path.resolve(__dirname, '..', 'packages', package, FILE_NAME))
    );

    console.log('');
    console.log(`   output: ${chalk.cyan(`packages/${package}/${FILE_NAME}`)}`);
    console.log(`   gzipped, the UMD build is ${chalk.green(prettyBytes(size))}`);
    console.log('');
  }
});
