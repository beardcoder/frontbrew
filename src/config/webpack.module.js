const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const GlobImporter = require('node-sass-glob-importer');
const Path = require('path');

/**
 * Environment from gitlab ci build
 * @type {boolean}
 */
const IS_CI_BUILD = !!process.env.CI;

module.exports = {
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: ExtractCssChunks.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            import: false,
                            importLoaders: 1,
                            sourceMap: !IS_CI_BUILD
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: !IS_CI_BUILD,
                            plugins: () => [
                                require('autoprefixer')({
                                    browsers: [
                                        'last 5 version',
                                        '> 1%',
                                        'ie > 9'
                                    ]
                                })
                            ]
                        }
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
                                    'node_modules'
                                )
                            ]
                        }
                    }
                ]
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
                        '.eslintrc'
                    ),
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: ExtractCssChunks.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            importLoaders: 1,
                            sourceMap: !IS_CI_BUILD
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: !IS_CI_BUILD,
                            config: {
                                path: __dirname
                            }
                        }
                    }
                ]
            }
        ]
    }
};
