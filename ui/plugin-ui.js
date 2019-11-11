"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import Iconify from '@iconify/iconify';

import style from './src/css/style.scss';
import UI from './src/ui';

/**
 * Send message to plugin
 *
 * @param {object} message
 */
function sendMessage(message) {
    parent.postMessage({
        pluginMessage: message
    }, '*');
}

/**
 * Load script
 *
 * @param {string} uri
 */
function loadScript(uri) {
    let script = document.createElement('script');
    script.setAttribute('async', true);
    script.setAttribute('src', uri);
    document.head.appendChild(script);
}

/**
 * Call done() after test() is successful
 *
 * @param {function} test
 * @param {function} done
 */
function delay(test, done) {
    let counter = 0,
        timer, result;

    function nextTick() {
        result = test();

        if (result) {
            // Success
            window.clearInterval(timer);
            done();
            return;
        }

        if (result === null) {
            // Stop execution
            window.clearInterval(timer);
            return;
        }

        // Test failed
        counter ++;
        if (counter === 10 || counter === 25) {
            // It takes too long. Reduce timeout
            window.clearInterval(timer);
            timer = window.setInterval(nextTick, counter === 10 ? 250 : 1000);
        }
    }

    // Do first test immediately
    result = test(counter);
    if (result) {
        done();
        return;
    }
    if (result === null) {
        return;
    }

    // Create timer
    timer = window.setInterval(nextTick, 100);
}

// Show notice that plug-in is in development mode, not ready for publishing
if (process.env.SEARCH_DEV) {
    console.log('Running plug-in in development mode!');
}

// Disable Iconify storage
Iconify.setConfig('localStorage', false);
Iconify.setConfig('sessionStorage', false);
if (process.env.ICONIFY_API) {
    // Use local API for development. See config.common.js
    Iconify.setConfig('defaultAPI', process.env.ICONIFY_API_VALUE);
}

// Load samples
loadScript('https://code.iconify.design/samples.js');
delay(counter => {
    return counter > 10 || Iconify.iconExists('mdi:account-check')
}, () => {
    let iconifyConfig = {};

    if (process.env.SEARCH_API) {
        // Use local API for development. See config.common.js
        iconifyConfig = {
            config: {
                API: {
                    URI: process.env.SEARCH_API_VALUE
                }
            }
        };
    }

    // UI instance
    let ui = null;
    window.onmessage = event => {
        let message = event.data.pluginMessage;

        if (typeof message !== 'object' || !message.event) {
            return;
        }
        console.log('Sent message to UI:', message);

        switch (message.event) {
            case 'show':
                let params = {
                };
                ui = new UI(document.getElementById('container'), params);
                break;
        }
    };

    sendMessage({
        event: 'loaded'
    });
});
