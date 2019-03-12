const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const GlobImporter = require('node-sass-glob-importer');
const Path = require('path');
const friendlyFormatter = require('eslint-friendly-formatter');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

/**
 * Environment from gitlab ci build
 * @type {boolean}
 */
const IS_CI_BUILD = !!process.env.CI;
const DEV_MODE = !!process.env.DEV_MODE;

module.exports = {
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: DEV_MODE ? 'style-loader' : ExtractCssChunks.loader,
                        options: {
                            hot: true,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            import: false,
                            importLoaders: 2,
                            sourceMap: !IS_CI_BUILD,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: !IS_CI_BUILD,
                            plugins: () => [
                                cssnano({
                                    preset: 'default',
                                }),
                                autoprefixer({
                                    browsers: [
                                        'last 5 version',
                                        '> 1%',
                                        'ie > 9',
                                    ],
                                }),
                            ],
                        },
                    },
                    {
                        loader: 'cache-loader',
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: !IS_CI_BUILD,
                            importer: GlobImporter(),
                            includePaths: [
                                Path.join(
                                    process.env.BASE_PATH,
                                    process.env.PROJECT_PRIVATE,
                                    'node_modules',
                                ),
                            ],
                        },
                    },
                ],
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: [/node_modules/, /Packages/],
                loader: 'eslint-loader',
                options: {
                    configFile: Path.join(
                        process.env.BASE_PATH,
                        process.env.PROJECT_PRIVATE,
                        '.eslintrc',
                    ),
                    formatter: friendlyFormatter,
                },
            },
            {
                test: /\.(ts|js)x?$/,
                exclude: [/core-js/, /@babel\/runtime/],
                use: {
                    loader: 'babel-loader',
                    options: {
                        extends: Path.join(
                            process.env.BASE_PATH,
                            process.env.PROJECT_PRIVATE,
                            '.babelrc',
                        ),
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: DEV_MODE ? 'style-loader' : ExtractCssChunks.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            importLoaders: 1,
                            sourceMap: !IS_CI_BUILD,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: !IS_CI_BUILD,
                            config: {
                                path: __dirname,
                            },
                        },
                    },
                ],
            },
        ],
    },
};
