/**
 * This file is part of the @iconify/icon-finder package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt or license.gpl.txt
 * files that were distributed with this source code.
 *
 * Licensed under Apache 2.0 or GPL 2.0 at your option.
 * If derivative product is not compatible with one of licenses, you can pick one of licenses.
 *
 * @license Apache 2.0
 * @license GPL 2.0
 */
"use strict";

import React, { Component } from 'react';

import FooterBlock from './block';

const phrases = require('../../../data/phrases');
const lang = phrases.footer;

const viewportId = 'viewport';

/**
 * Check if selected node exists
 *
 * @param {Array} nodes
 * @param {string} selectedId
 * @return {boolean}
 */
function findSelectedNode(nodes, selectedId) {
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === selectedId || findSelectedNode(nodes[i].children, selectedId)) {
            return true;
        }
    }
    return false;
}

class FooterNodeOptions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            counter: 1
        };
    }

    render() {
        let props = this.props,
            nodes = props.app.selectedNodes;

        if (!nodes || !nodes.length) {
            return null;
        }

        // Get selected node
        let selectedId = typeof props.app.selection.node === 'string' ? props.app.selection.node : '',
            hasSelection = selectedId ? selectedId === viewportId || findSelectedNode(nodes, selectedId) : false;

        if (selectedId && !hasSelection) {
            props.app.selection.node = '';
        }

        // Add components for all nodes
        let items = [];

        const add = (node, level) => {
            items.push(this.renderNode(node, level, hasSelection ? node.id === selectedId : node.default));

            // Add children
            node.children.forEach(child => {
                add(child, level + 1);
            });
        };

        // Add component for viewport
        items.push(this.renderNode({
            id: viewportId,
            type: 'VIEWPORT',
            name: 'Viewport',
        }, 0, selectedId === viewportId));

        // Add all nodes
        nodes.forEach(node => {
            add(node, 0)
        });


        return <FooterBlock type="nodes" title={lang.importOptions}>
            <div className="plugin-footer-nodes">
                <div>{lang.parentNode}</div>
                {items}
            </div>
        </FooterBlock>;
    }

    renderNode(node, level, selected) {
        let key = node.id + '-' + level;

        return <div key={key}>
            <a href="#" onClick={this.nodeClicked.bind(this, node.default ? '' : node.id)}>
                {level + ' [' + node.id + '] :' + node.type + ': ' + node.name} {selected ? (node.default ? ' (default)' : ' (selected)') : (node.default ? ' (default)' : '')}
            </a>
        </div>;
    }

    /**
     * Change selected node
     *
     * @param {string} id
     * @param event
     */
    nodeClicked(id, event) {
        event.preventDefault();
        if (this.props.app.selection.node === id) {
            return;
        }
        this.props.app.selection.node = id;
        this.setState({
            counter: this.state.counter + 1
        });
    }
}

export default FooterNodeOptions;
