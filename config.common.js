"use strict";

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Common configuration file for development and production.
 * Returns configuration object
 *
 * @param {boolean} prod
 * @return {object}
 */
module.exports = prod => {
    // Local API entry points
    // Add custom data to api.json (see api.json-localhost)
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
        // Prevent eval() in source code
        devtool: false,

        // Entries for UI and plug-in
        entry: {
            ui: './ui/plugin-ui.js',
            plugin: './plugin/plugin.ts'
        },

        // Output: same as names in entries, stored in "dist"
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist')
        },

        module: {
            rules: [
                // Typescript: use ts-loader
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: 'ts-loader',
                },
                // JavaScript: use babel-loader
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
                // SASS: use loaders to compile store it in js file
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
            // Conditional statements in js files, so dev version could have stuff like custom API entry and log debug stuff
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

            // Parse HTML file, store it as ui.html. ui.js will be added inline
            new HtmlWebpackPlugin({
                template: './ui/plugin-ui.html',
                filename: 'ui.html',
                inlineSource: '.(js)$',
                chunks: ['ui'],
            }),
            new HtmlWebpackInlineSourcePlugin(),
        ],

        // List of extensions for ES imports
        resolve: {
            extensions: ['.tsx', '.ts', '.jsx', '.js'],
        },
    };
};
