const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const toCamelCase = require('lodash/camelCase');
const webpack = require('webpack');
const prettyBytes = require('pretty-bytes');
const gzipSize = require('gzip-size');

const { argv } = require('yargs');

const packageName = argv.package;
const allowed = ['rockey', 'rockey-react', 'rockey-css-parse'];

if (allowed.indexOf(packageName) === -1) {
  throw new Error(`package "${packageName}" is not allowed`);
}

const FILE_NAME = `${packageName}.min.js`;

const compiler = webpack({
  context: path.resolve(__dirname, '..', 'packages', packageName),

  entry: './index.js',

  output: {
    path: path.resolve(__dirname, '..', 'packages', packageName),
    filename: FILE_NAME,
    library: toCamelCase(packageName),
    libraryTarget: 'umd',
  },

  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'react-dom',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
    recompose: {
      root: 'recompose',
      commonjs2: 'recompose',
      commonjs: 'recompose',
      amd: 'recompose',
    },
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      compress: {
        warnings: false,
        drop_console: false,
      },
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      'process.NODE_ENV': '"production"',
    }),
  ],
});

console.log('');
console.log(`   Minify: ${chalk.cyan(packageName)}`);
console.log('');

compiler.run((err, stats) => {
  if (err || stats.hasErrors()) {
    console.log(stats);
  } else {
    const size = gzipSize.sync(
      fs.readFileSync(
        path.resolve(__dirname, '..', 'packages', packageName, FILE_NAME)
      )
    );

    console.log('');
    console.log(
      `   output: ${chalk.cyan(`packages/${packageName}/${FILE_NAME}`)}`
    );
    console.log(
      `   gzipped, the UMD build is ${chalk.green(prettyBytes(size))}`
    );
    console.log('');
  }
});
