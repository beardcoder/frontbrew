/* eslint global-require: 0 */

const config = {
    plugins: [
        require('postcss-import'),
        require('precss'),
        require('postcss-mixins'),
        require('postcss-color-function'),
        require('postcss-preset-env')({
            browsers: ['last 5 version', '> 1%', 'ie > 9'],
        }),
        require('cssnano'),
    ],
};

module.exports = config;
