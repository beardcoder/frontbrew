import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import webpack from "webpack";
import TerserJSPlugin from "terser-webpack-plugin";

const IS_CI_BUILD = !!process.env.CI;

const config: webpack.Configuration = {
    optimization: {
        moduleIds: "hashed",
        minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()],
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: "styles",
                    test: /\.css$/,
                    chunks: "all",
                    enforce: true,
                },
            },
        },
    },
};

export default config;
