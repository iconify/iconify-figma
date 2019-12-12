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
import Align from '../../parts/inputs/align';
import Layer from '../../parts/layer';

const phrases = require('../../../data/phrases');
const lang = phrases.footer;

class FooterNodeOptions extends Component {
    render() {
        let props = this.props,
            options = props.app.options,
            nodes = props.app.selectedNodes,
            showAlign = true,
            items = [];

        if (!nodes || !nodes.length || !nodes[0]) {
            return null;
        }

        // Get selected node
        let selectedId = options.node,
            hasSelection = selectedId !== '';

        // Add components for all nodes
        const add = (node, level) => {
            let selected = hasSelection ? node.id === selectedId : node.default;

            items.push(this.renderNode(node, level, selected));

            // Check for node type
            if (selected) {
                switch (node.type) {
                    case 'PAGE':
                        // Cannot show alignment on page node yet
                        showAlign = false;
                        break;

                    case 'FRAME':
                        // Frame uses auto-layout, alignment box is irrelevant
                        // if (node.layoutMode === 'HORIZONTAL' || node.layoutMode === 'VERTICAL') {
                        //     showAlign = false;
                        // }
                        break;
                }
            }

            // Add children
            node.children.forEach(child => {
                add(child, level + 1);
            });
        };

        // Add all nodes
        nodes.forEach(node => {
            add(node, 0)
        });

        // Check if there are viable choices
        if (items.length < 2) {
            return null;
        }

        return <FooterBlock type="nodes" title={showAlign ? lang.nodeOptions : lang.nodeOptionsPage}>
            <div className="plugin-footer-nodes-wrapper">
                <div className="plugin-footer-nodes">
                    <div className="plugin-layers">
                        {items}
                    </div>
                </div>
                {showAlign && <div className="plugin-footer-nodes-align">
                    <Align
                        x={options.nodeX}
                        y={options.nodeY}
                        onChange={this._onAlignChange.bind(this)}
                    />
                </div>}
            </div>
        </FooterBlock>;
    }

    renderNode(node, level, selected) {
        let key = node.id + '-' + level;

        // {level + ' [' + node.id + '] :' + node.type + ': ' + node.name} {selected ? (node.default ? ' (default, selected)' : ' (selected)') : (node.default ? ' (default)' : '')}
        return <Layer
            key={key}
            level={level}
            title={node.name}
            selected={selected}
            icon={node.type.toLowerCase()}
            skipToggle={true}
            onClick={this._onNodeClick.bind(this, node.default ? '' : node.id)}
        />;
    }

    /**
     * Change selected node
     *
     * @param {string} id
     * @private
     */
    _onNodeClick(id) {
        if (this.props.app.options.node === id) {
            return;
        }
        this.props.onOptionChange('node', id);
    }

    /**
     * Change align
     *
     * @param {boolean} horizontal
     * @param {string} value
     * @private
     */
    _onAlignChange(horizontal, value) {
        this.props.onOptionChange('node' + (horizontal ? 'X' : 'Y'), value);
    }
}

export default FooterNodeOptions;
