const { watch } = require('fs');
const path = require('path');

module.exports = {
    mode: 'production',
    entry: ['./src/js/index.js'],
    output: {
        filename: 'twee/js-dist.js',
        path: path.resolve(__dirname, 'src')
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                include: [
                    path.resolve(__dirname, "src/js"),
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.html$/,
                loader: "raw-loader"
            }
        ]
    },
    devServer: {
        hot: true,
        open: true,
        port: 3000,
    }
}