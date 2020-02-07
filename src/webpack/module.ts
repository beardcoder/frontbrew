import MiniCssExtractPlugin from "mini-css-extract-plugin";
import GlobImporter from "node-sass-glob-importer";
import path from "path";
import friendlyFormatter from "eslint-friendly-formatter";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import webpack from "webpack";
import reporter from "postcss-reporter";

const IS_CI_BUILD = !!process.env.CI;
const DEV_MODE = !!process.env.DEV_MODE;

let styleloaderOptions = {};

if (!DEV_MODE) {
    styleloaderOptions = {
        options: {
            hmr: !IS_CI_BUILD
        }
    };
}

const config: webpack.Configuration = {
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: DEV_MODE
                            ? "style-loader"
                            : MiniCssExtractPlugin.loader,
                        ...styleloaderOptions
                    },
                    {
                        loader: "css-loader",
                        options: {
                            url: false,
                            import: false,
                            importLoaders: 1,
                            sourceMap: !IS_CI_BUILD
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: !IS_CI_BUILD,
                            plugins: (): any => [
                                cssnano({
                                    preset: "default"
                                }),
                                autoprefixer({
                                    cascade: !IS_CI_BUILD,
                                    grid: "autoplace"
                                }),
                                reporter()
                            ]
                        }
                    },
                    {
                        loader: "cache-loader"
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: !IS_CI_BUILD,
                            sassOptions: {
                                importer: GlobImporter(),
                                includePaths: [
                                    path.join(
                                        process.env.BASE_PATH,
                                        process.env.PROJECT_PRIVATE,
                                        "node_modules"
                                    )
                                ]
                            }
                        }
                    }
                ]
            },
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: [/node_modules/, /Packages/],
                loader: "eslint-loader",
                options: {
                    configFile: path.join(
                        process.env.BASE_PATH,
                        process.env.PROJECT_PRIVATE,
                        ".eslintrc"
                    ),
                    formatter: friendlyFormatter
                }
            },
            {
                test: /\.(ts|js)x?$/,
                exclude: [/core-js/, /@babel\/runtime/],
                use: {
                    loader: "babel-loader",
                    options: {
                        extends: path.join(
                            process.env.BASE_PATH,
                            process.env.PROJECT_PRIVATE,
                            ".babelrc"
                        )
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: DEV_MODE
                            ? "style-loader"
                            : MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader",
                        options: {
                            url: false,
                            importLoaders: 1,
                            sourceMap: !IS_CI_BUILD
                        }
                    },
                    {
                        loader: "postcss-loader",
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

export default config;
