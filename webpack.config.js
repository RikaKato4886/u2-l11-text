const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: './bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        'style-loader', // creates style nodes from JS strings
        'css-loader', // translates CSS into CommonJS
        'sass-loader', // compiles Sass to CSS
      ],
    },
    {
      test: /\.(js)$/,
      exclude: /node_modules/,
      // loader: 'eslint-loader', エラーが出るのでこちらに変更
      use: [
        {
          loader: "eslint-loader",
          query: {
            name: 'bundle.js'
        }
        }
      ]
      // options: {同様
      //   // eslint options (if necessary)
      // },
    }],
  },
  devServer: {
    hot: true,
    hotOnly: true,
    watchContentBase: true,
    watchOptions: {
      ignored: /node_modules/,
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
};
