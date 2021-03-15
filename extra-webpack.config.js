const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = {
  module: {
    rules: [],
  },
  plugins: [new FriendlyErrorsWebpackPlugin()],
};
