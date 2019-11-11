"use strict";

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = prod => {
    // Local API entry points
    // Add custom data to api.json
    // Also see config.dev-ui.js
    let localAPI = {
        iconify: null,
        search: null
    };
    if (!prod) {
        try {
            let data = fs.readFileSync('./api.json', 'utf8');
            data = JSON.parse(data);
            if (typeof data === 'object') {
                Object.assign(localAPI, data);
            }
        } catch (err) {
        }
    }

    // Return object
    return {
        devtool: false,
        entry: {
            ui: './ui/plugin-ui.js',
            plugin: './plugin/plugin.ts'
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist')
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: 'ts-loader',
                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader',
                    ],
                },
            ],
        },
        plugins: [
            new webpack.DefinePlugin({
                SEARCH_VERSION: JSON.stringify(require('./package.json').version),
                'process.env': {
                    SEARCH_DEV: !prod,
                    SEARCH_ENV: JSON.stringify('browser'),
                    ICONIFY_API: localAPI.iconify !== null,
                    ICONIFY_API_VALUE: JSON.stringify(localAPI.iconify),
                    SEARCH_API: localAPI.search !== null,
                    SEARCH_API_VALUE: JSON.stringify(localAPI.search),
                },
            }),
            new HtmlWebpackPlugin({
                template: './ui/plugin-ui.html',
                filename: 'ui.html',
                inlineSource: '.(js)$',
                chunks: ['ui'],
            }),
            new HtmlWebpackInlineSourcePlugin(),
        ],
        resolve: {
            extensions: ['.tsx', '.ts', '.jsx', '.js'],
        },
        // externals: {
        //     '@iconify/iconify': {
        //         root: 'Iconify'
        //     }
        // },
    };
};
