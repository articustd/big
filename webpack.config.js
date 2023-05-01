const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: 'production',
    entry: './src/js/index.js',
    output: {
        filename: 'story.bundle.js',
        path: path.resolve(__dirname, 'story/modules')
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
            "@Utils": path.resolve(__dirname, 'src', 'js','Utils'),
            "@Controller": path.resolve(__dirname, 'src', 'js', 'Controllers'),
            "@GameObjects": path.resolve(__dirname, 'src', 'js', 'GameObjects'),
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