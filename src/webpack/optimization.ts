import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import webpack from "webpack";
import TerserJSPlugin from "terser-webpack-plugin";

const IS_CI_BUILD = !!process.env.CI;

const config: webpack.Configuration = {
    optimization: {
        minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()]
    }
};

export default config;
