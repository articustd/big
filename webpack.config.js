const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: 'production',
    entry: './src/js/index.js',
    output: {
        filename: 'story.bundle.js'
    },
    target: 'web',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components|story|vendor)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.json5$/i,
                loader: 'json5-loader',
                options: {
                    esModule: true,
                },
                type: 'javascript/auto'
            }
        ]
    },
    resolve: {
        alias: {
            "@util": path.resolve(__dirname, 'src', 'js', 'controller','util'),
            "@controller": path.resolve(__dirname, 'src', 'js', 'controller'),
            "@js": path.resolve(__dirname, 'src', 'js')
        },
        extensions: ['.js', '.json']
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            extractComments: false,
        })],
    },
};