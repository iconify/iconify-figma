"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import Iconify from '@iconify/iconify';

import style from './src/css/style.scss';
import UI from './src/ui';

let iconifyConfig = {};

// Use local API for development. See config.common.js
if (process.env.ICONIFY_API) {
    Iconify.setConfig('defaultAPI', process.env.ICONIFY_API_VALUE);
}
if (process.env.SEARCH_API) {
    iconifyConfig = {
        config: {
            API: {
                URI: process.env.SEARCH_API_VALUE
            }
        }
    };
}

let params = {
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

    // layout
    list: true,

    // custom changes
    custom: {
        color: '#a20',
        hFlip: true,
        rotate: 1
    },

    // selected icon
    selection: {
        iconName: 'mdi-home'
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
