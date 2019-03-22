import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import GlobImporter from 'node-sass-glob-importer';
import path from 'path';
import friendlyFormatter from 'eslint-friendly-formatter';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import webpack from "webpack";
import reporter from 'postcss-reporter';

/**
 * Environment from gitlab ci build
 * @type {boolean}
 */
const IS_CI_BUILD = !!process.env.CI;
const DEV_MODE = !!process.env.DEV_MODE;

let styleloaderOptions = {};

if (!DEV_MODE) {
    styleloaderOptions = {
        options: {
            hot: true,
        },
    };
}


const config: webpack.Configuration = {
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: DEV_MODE ? 'style-loader' : ExtractCssChunks.loader,
                        ...styleloaderOptions,
                    },
                    {
                        loader: 'css-loader',
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
                                reporter()
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
                                path.join(
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
                    configFile: path.join(
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
                        extends: path.join(
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

export default config;
