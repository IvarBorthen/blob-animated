const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
  mode: 'development',
  devtool: PRODUCTION ? 'source-map' : 'inline-source-map',
  entry: ['./example'].filter(e => !!e),
  output: {
    filename: '[name].[hash].bundle.js',
    path: path.resolve(__dirname, 'example/dist')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(jpe?g|gif|png|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: { 'blob': path.resolve('./src'), 'react-dom': '@hot-loader/react-dom' },
    extensions: ['.ts', '.tsx', '.js', '.jpg', '.png', '.gif'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: false,
      filename: 'index.html',
      title: 'Blob example',
      template: './example/index.html',
    }),
  ],
  optimization: {
    minimizer: [new TerserPlugin()]
  }
};