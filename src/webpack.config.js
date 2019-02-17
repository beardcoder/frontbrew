const path = require('path');
const merge = require('webpack-merge');
const webpackPlugins = require('./config/webpack.plugins');
const webpackOptimization = require('./config/webpack.optimization');
const webpackModule = require('./config/webpack.module');

/**
 * Environment from gitlab ci build
 * @type {boolean}
 */
const IS_CI_BUILD = !!process.env.CI;
const ENV = IS_CI_BUILD ? 'production' : 'development';

const config = {
    mode: ENV,
    devtool: IS_CI_BUILD ? false : 'inline-source-map',
    entry: {
        main: path.join(
            process.env.BASE_PATH,
            process.env.PROJECT_PRIVATE,
            'webpack.entrypoint.js',
        ),
    },
    output: {
        path: path.join(
            process.env.BASE_PATH,
            process.env.PROJECT_PUBLIC,
        ),
        filename: path.join(
            process.env.SCRIPTS_PATH,
            '[name].js',
        ),
        publicPath: process.env.PUBLIC_PATH,
        pathinfo: false,
    },
    devServer: {
        publicPath: process.env.PUBLIC_PATH,
        host: '0.0.0.0',
        port: 3000,
        proxy: [
            {
                context: '/',
                target: `http://${process.env.PROXY_HOST}`,
            },
        ],
        disableHostCheck: true,
        hot: true,
        overlay: true,
        stats: {
            modules: false,
            hash: false,
            version: false,
            timings: true,
            chunks: false,
            children: false,
            source: false,
            publicPath: false,
        },
    },
};

module.exports = merge(
    config,
    merge(webpackPlugins, merge(webpackModule, webpackOptimization)),
);
