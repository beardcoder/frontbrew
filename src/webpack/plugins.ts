import MiniCssExtractPlugin from "mini-css-extract-plugin";
import StyleLintPlugin from "stylelint-webpack-plugin";
import path from "path";
import webpack from "webpack";

const IS_CI_BUILD = !!process.env.CI;
const ENV: string = IS_CI_BUILD ? "production" : "development";

const config: webpack.Configuration = {
    plugins: [
        new webpack.DefinePlugin({
            "process.env": ENV
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: process.env.STYLES_PATH + process.env.STYLES_FILE,
            chunkFilename: `${process.env.STYLES_PATH}[id].css`
        }),
        new StyleLintPlugin({
            configFile: path.join(
                process.env.BASE_PATH,
                process.env.PROJECT_PRIVATE,
                ".stylelintrc.json"
            ),
            context: path.resolve(
                process.env.BASE_PATH,
                process.env.PROJECT_PRIVATE
            )
        })
    ]
};

export default config;
