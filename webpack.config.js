/* eslint-disable @typescript-eslint/no-var-requires */
// webpack will throw error if 'import' statement used instead of require statement
// but TypeScript will use ES6 modules in rest of project, so just disabled the rule for this file

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('WebpackBar');
require('dotenv').config();
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { NODE_ENV = 'production' } = process.env;

module.exports = {
  mode: NODE_ENV,
  devtool: NODE_ENV === 'development' ? 'inline-source-map' : 'source-map',
  watch: NODE_ENV === 'development',
  entry: './src/client/index.tsx',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
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
    publicPath: '/',
  },
  plugins: [
    new WebpackBar(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/client/index.ejs')
    }),
    // new BundleAnalyzerPlugin()
  ]
};
