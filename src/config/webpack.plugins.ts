import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import path from 'path';
import webpack from 'webpack';

/**
 * Environment from gitlab ci build
 * @type {boolean}
 */
const IS_CI_BUILD = !!process.env.CI;
const ENV = IS_CI_BUILD ? 'production' : 'development';
const clean = process.env.CLEAN_BUILD ? [new CleanWebpackPlugin()] : [];

const config: webpack.Configuration = {
    plugins: [
        new webpack.ProgressPlugin(),
        ...clean,
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
        new webpack.DefinePlugin({
            'process.env': ENV,
        }),
        new ExtractCssChunks({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: process.env.STYLES_PATH + process.env.STYLES_FILE,
            chunkFilename: `${process.env.STYLES_PATH}[id].css`,
        }),
        new StyleLintPlugin({
            configFile: path.join(
                process.env.BASE_PATH,
                process.env.PROJECT_PRIVATE,
                '.stylelintrc.json',
            ),
            context: path.resolve(process.env.BASE_PATH, process.env.PROJECT_PRIVATE),
            files: '**/*.scss',
            quiet: false,
            syntax: 'scss'
        }),
    ],
};

export default config;
