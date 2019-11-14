"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import Iconify from '@iconify/iconify';

import style from './src/css/style.scss';
import UI from './src/ui';

// UI configuration
const itemsPerPage = 55; // 5 rows x 11 icons. Also see plugin-ui.js
let iconifyConfig = {
    config: {
        itemsPerPage: itemsPerPage,
        search: {
            limit: itemsPerPage * 2,
        },
    }
};

// Use local API for development. See config.common.js
if (process.env.ICONIFY_API) {
    Iconify.setConfig('defaultAPI', process.env.ICONIFY_API_VALUE);
}
if (process.env.SEARCH_API) {
    iconifyConfig.config.API = {
        URI: process.env.SEARCH_API_VALUE
    };
}

let params = {
    callback: (event, data) => {
        console.log('Callback to plugin:', event, data);
    },

    iconify: iconifyConfig,

    // prefix: 'ic',

    route: {
        page: 'iconify',
        iconify: {
            type: 'collection',
            params: {
                prefix: 'ic',
                page: 1,
                search: 'arrow',
            },
            parent: {
                type: 'collections'
            }
        }
    },

    // state
    options: {
        // selected icon
        icon: 'mdi:home',

        // selected node
        node: '0:11',

        // icon changes
        color: '#a20',
        hFlip: true,
        rotate: 1,

        // layout
        list: true,
    },

    // saved lists
    storage: {
        recent: [
            'mdi:home',
            'ic:baseline-build',
            'ic:missing' // invalid entry
        ],
        bookmarks: [
            'bytesize:home',
            'el:home',
            'el:home-alt'
        ]
    },

    // parent nodes
    parentNodes: [
        {"id":"0:1","type":"PAGE","name":"Tests","parents":[]},
        {"id":"130:38","type":"FRAME","name":"footer","parents":["130:35","0:1"], "default": true},
        {"id":"130:37","type":"GROUP","name":"Layer with a very very very very very very very very very very long name to test overflow","parents":["130:35","0:1"]},
        {"id":"130:35","type":"FRAME","name":"iOS stuff","parents":["0:1"]}
    ],
};

var ui = new UI(document.getElementById('container'), params);

// Test showCode()
setTimeout(function () {
    ui.showCode({
        icon: 'fe:home',
        color: 'red',
        width: 24,
        height: 24,
    });
}, 5000);

// Test notices
setTimeout(() => {
    ui.addNotice('Testing notice!');
}, 1000);
setTimeout(() => {
    ui.addNotice('Error message!', {type: 'error'});
}, 2000);
setTimeout(() => {
    ui.addNotice('This will stay for 10 seconds', {expiration: 10000});
}, 2500);
setTimeout(() => {
    ui.addNotice('A warning?', {type: 'warning'});
}, 4000);
setTimeout(() => {
    ui.addNotice('A very very very very very very very very very very very very very very very very very very very very long notice to test text wrapping?');
}, 6000);
