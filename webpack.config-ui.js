"use strict";

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');

// Local API entry points
// Add custom data to api.json
// Also see config.common.js
let localAPI = {
    iconify: null,
    search: null
};
try {
    let data = fs.readFileSync('./api.json', 'utf8');
    data = JSON.parse(data);
    if (typeof data === 'object') {
        Object.assign(localAPI, data);
    }
} catch (err) {
}

/**
 * Configuration for UI debug
 *
 * @type {object}
 */
module.exports = {
    entry: './ui/dev-ui.js',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            SEARCH_VERSION: JSON.stringify(require('./package.json').version),
            'process.env': {
                SEARCH_DEV: true,
                SEARCH_ENV: JSON.stringify('browser'),
                ICONIFY_API: localAPI.iconify !== null,
                ICONIFY_API_VALUE: JSON.stringify(localAPI.iconify),
                SEARCH_API: localAPI.search !== null,
                SEARCH_API_VALUE: JSON.stringify(localAPI.search),
            },
        }),
        new HtmlWebPackPlugin({
            template: './ui/dev-ui.html',
            filename: './index.html'
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
    },
};
