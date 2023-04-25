const webpack = require('webpack');

const config = {  
  entry: './src/slider.js',
  output: {
    path: __dirname + '/dist',
    filename: 'slider.js',
	libraryTarget: "umd"
  },
}

module.exports = config;