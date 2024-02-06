/* eslint-disable @typescript-eslint/no-var-requires */
// webpack will throw error if 'import' statement used instead of require statement
// but TypeScript will use ES6 modules in rest of project, so just disabled the rule for this file

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config();

const { NODE_ENV = 'production' } = process.env;

module.exports = {
  mode: NODE_ENV,
  devtool: NODE_ENV === 'development' ? 'inline-source-map' : 'source-map',
  watch: NODE_ENV === 'development',
  entry: './src/client/index.tsx',
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-typescript', '@babel/preset-env'],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './src/client/dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/client/index.ejs')
    })
  ]
};