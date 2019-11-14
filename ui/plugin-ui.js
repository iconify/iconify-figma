"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import Iconify from '@iconify/iconify';

import style from './src/css/style.scss';
import UI from './src/ui';

// Items per page
const itemsPerPage = 55; // 5 rows x 11 icons. Also see dev-ui.js

/**
 * Send message to plugin
 *
 * @param {string} event
 * @param {object} [data]
 */
function sendMessage(event, data) {
    if (process.env.SEARCH_DEV) {
        console.log('Message from UI', event, data);
    }
    parent.postMessage({
        pluginMessage: {
            event: event,
            data: data
        }
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
    // Do not delay for more than 1 second
    return counter > 10 || Iconify.iconExists('mdi:account-check')
}, () => {
    let iconifyConfig = {
        config: {
            itemsPerPage: itemsPerPage,
            search: {
                limit: itemsPerPage * 2,
            },
        }
    };

    if (process.env.SEARCH_API) {
        // Use local API for development. See config.common.js
        iconifyConfig.config.API = {
            URI: process.env.SEARCH_API_VALUE
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
                // Show UI
                let params = {
                    iconify: iconifyConfig,
                    stored: message.config,
                    parentNodes: message.parentNodes,
                    callback: sendMessage,
                };
                ui = new UI(document.getElementById('container'), params);
                break;

            case 'selected-nodes':
                // Update list of possible parent nodes
                ui.setSelectedNodes(message.nodes);
                break;

            case 'error':
            case 'notice':
            case 'success':
                ui.addNotice(message.message, Object.assign({
                    type: message.event
                }, message));
                break;
        }
    };

    // Notify plugin that UI has finished loading
    sendMessage('loaded', process.env.SEARCH_DEV);
});
