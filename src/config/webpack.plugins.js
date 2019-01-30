const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const Webpack = require('webpack');
const Path = require('path');

/**
 * Environment from gitlab ci build
 * @type {boolean}
 */
const IS_CI_BUILD = !!process.env.CI;
const ENV = IS_CI_BUILD ? 'production' : 'development';

module.exports = {
    plugins: [
        new Webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),
        new Webpack.DefinePlugin({
            'process.env': ENV
        }),
        new WriteFilePlugin({
            test: fileName => {
                return fileName.indexOf('hot-update') === -1;
            }
        }),
        new ExtractCssChunks({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: process.env.STYLES_PATH + process.env.STYLES_FILE,
            chunkFilename: process.env.STYLES_PATH + '[id].css'
        }),
        new StyleLintPlugin({
            configFile: Path.join(
                process.env.BASE_PATH,
                process.env.PROJECT_PRIVATE,
                '.stylelintrc.json'
            ),
            failOnError: IS_CI_BUILD
        })
    ]
};
