/* eslint global-require: 0 */

const config = {
    plugins: [
        require('postcss-import'),
        require('precss'),
        require('postcss-mixins'),
        require('postcss-color-function'),
        require('postcss-preset-env'),
        require('cssnano'),
    ],
};

module.exports = config;
