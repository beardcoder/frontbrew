import path from "path";
import merge from "webpack-merge";
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration;
}

import webpackPlugins from "./webpack/plugins";
import webpackOptimization from "./webpack/optimization";
import webpackModule from "./webpack/module";

const IS_CI_BUILD = !!process.env.CI;
const ENV = IS_CI_BUILD ? "production" : "development";

const config: Configuration = {
    mode: ENV,
    devtool: IS_CI_BUILD ? false : "eval",
    entry: {
        main: path.join(
            process.env.BASE_PATH,
            process.env.PROJECT_PRIVATE,
            "webpack.entrypoint.js"
        ),
    },
    output: {
        path: path.join(process.env.BASE_PATH, process.env.PROJECT_PUBLIC),
        filename: path.join(process.env.SCRIPTS_PATH, "[name].js"),
        chunkFilename: "[name].[chunkhash:4].js",
        publicPath: process.env.PUBLIC_PATH,
        pathinfo: false,
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
        alias: {
            "@": path.join(process.env.BASE_PATH, process.env.PROJECT_PRIVATE),
            "~": path.join(process.env.BASE_PATH, process.env.PROJECT_PRIVATE),
        },
    },
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
    devServer: {
        publicPath: process.env.PUBLIC_PATH,
        host: "0.0.0.0",
        compress: true,
        contentBase: path.join(
            process.env.BASE_PATH,
            process.env.PROJECT_PUBLIC
        ),
        writeToDisk: (filePath) => filePath.indexOf("hot-update") === -1,
        port: 3000,
        proxy: [
            {
                context: "/",
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
    merge(webpackPlugins, merge(webpackModule, webpackOptimization))
);
