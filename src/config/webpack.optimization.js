const BabelMinifyPlugin = require('babel-minify-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const IS_CI_BUILD = !!process.env.CI;

module.exports = {
    optimization: {
        removeAvailableModules: IS_CI_BUILD,
        removeEmptyChunks: IS_CI_BUILD,
        splitChunks: false,
        minimizer: [new BabelMinifyPlugin(), new OptimizeCSSAssetsPlugin()],
    },
};
