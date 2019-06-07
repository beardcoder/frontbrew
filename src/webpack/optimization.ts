import BabelMinifyPlugin from 'babel-minify-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import webpack from 'webpack';

const IS_CI_BUILD = !!process.env.CI;

const config: webpack.Configuration = {
    optimization: {
        removeAvailableModules: IS_CI_BUILD,
        removeEmptyChunks: IS_CI_BUILD,
        splitChunks: false,
        minimizer: [new BabelMinifyPlugin(), new OptimizeCSSAssetsPlugin()],
    },
};

export default config;
