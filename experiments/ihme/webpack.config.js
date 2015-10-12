var path = require('path');
var webpack = require('webpack');

var config = {
  context: __dirname
};

config.entry = path.join(__dirname, 'src', 'main.js');

config.module = {
  loaders: [
    {
      loader:  'babel',
      test:    /\.es6.js$/,
      exclude: /node_modules/
    }
  ],
  postLoaders: []
};

config.output = {
  filename: '[name].bundle.js',
  chunkFilename: '[id].chunk.js',
  path: path.join(__dirname, 'js'),
  publicPath: '/js',
  devtoolModuleFilenameTemplate: '[resourcePath]',
  devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
};

config.plugins = [
  new webpack.DefinePlugin({
    __DATA_PATH__: "'/experiments/ihme/data'"
  })
];

config.resolve = {
  extensions: [
    '',
    '.js'
  ],
  modulesDirectories: [
    './node_modules/'
  ]
};

module.exports = config;
