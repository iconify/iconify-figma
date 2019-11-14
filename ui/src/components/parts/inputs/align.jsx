"use strict";

import React, { Component } from 'react';
import Select from './select';

const phrases = require('../../../data/phrases');
const constants = require('../../../data/const');

// Width of left/top side
const gridSideWidth = 18;

// Width of middle box
const gridMidWidth = 25;

// Offset of right/bottom side
const gridOtherSide = gridSideWidth + gridMidWidth;

// Total width
const gridWidth = gridSideWidth * 2 + gridMidWidth;

// Paths for each icon path
const iconParts = {
    left: {
        selected: 'M4 29h10v3H4z',
        unselected: 'M4 30h10v1H4z',
    },
    center: {
        selected: 'M22 29h17v3H22z',
        unselected: 'M22 30h17v1H22z',
    },
    right: {
        selected: 'M47 29h10v3H47z',
        unselected: 'M47 30h10v1H47z',
    },
    top: {
        selected: 'M29 4h3v10h-3z',
        unselected: 'M30 4h1v10h-1z',
    },
    middle: {
        selected: 'M29 22h3v17h-3z',
        unselected: 'M30 22h1v17h-1z',
    },
    bottom: {
        selected: 'M29 47h3v10h-3z',
        unselected: 'M30 47h1v10h-1z',
    },
};

class AlignInput extends Component {
    render() {
        let props = this.props,
            x = props.x,
            y = props.y,
            options = {};

        ['x', 'y'].forEach(side => {
            let langKey = 'align' + side.toUpperCase();

            options[side] = {};
            constants[langKey].forEach(key => {
                options[side][key] = phrases[langKey] !== void 0 && phrases[langKey][key] !== void 0 ? phrases[langKey][key] : key.slice(0, 1).toUpperCase() + key.slice(1);
            });
        });

        return <div className="plugin-align">
            <div className="plugin-align-box">
                <a
                    href="#"
                    onClick={this.boxClicked.bind(this)}
                    dangerouslySetInnerHTML={{__html: this._renderSVG([x, y])}} ref={node => this.linkNode = node}
                />
            </div>
            <div className="plugin-align-select">
                <Select icon="arrows-horizontal" value={x} options={options.x} onChange={this.onChange.bind(this, true)} />
                <Select icon="arrows-vertical" value={y} options={options.y} onChange={this.onChange.bind(this, false)} />
            </div>
        </div>
    }

    /**
     * Render box
     *
     * @param {Array} values
     * @return {string}
     * @private
     */
    _renderSVG(values) {
        let result = '<svg xmlns="http://www.w3.org/2000/svg" width="61" height="61" viewBox="0 0 61 61">' +
            '<path d="M18.5 18.5h24v24h-24v-24z" class="plugin-box-icon--grid" stroke-dasharray="2"/>';

        let paths = {
            selected: [],
            unselected: []
        };

        Object.keys(iconParts).forEach(key => {
            let selected = values.indexOf(key) !== -1;
            paths[selected ? 'selected' : 'unselected'].push('<path d="' + iconParts[key][selected ? 'selected' : 'unselected'] + '" class="plugin-box-icon--' + (selected ? 'selected' : 'unselected') + '"/>');
        });

        // Add unselected paths first to make sure selected paths are always fully visible above unselected paths
        return result + paths.unselected.join('') + paths.selected.join('') + '</svg>';
    }

    /**
     * Change alignment
     *
     * @param {boolean} horizontal
     * @param {string} value
     */
    onChange(horizontal, value) {
        let props = this.props;
        if (props.onChange) {
            props.onChange(horizontal, value);
        }
    }

    /**
     * Click on box
     *
     * @param event
     */
    boxClicked(event) {
        let x, y;

        event.preventDefault();
        try {
            let rect = this.linkNode.getBoundingClientRect();
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
        } catch (err) {
            return;
        }

        if (x < 0 || y < 0 || x > gridWidth || y > gridWidth) {
            return;
        }

        // Check horizontal location for left/right
        if (x < gridSideWidth || x >= gridOtherSide) {
            // left or right
            if (y >= gridSideWidth && y < gridOtherSide) {
                // middle
                this.onChange(true, constants.alignX[x < gridSideWidth ? 0 : 2]);
            }
            return;
        }

        // Check vertical location for top/bottom
        if (y < gridSideWidth || y >= gridOtherSide) {
            // top or bottom, but not left/right
            this.onChange(false, constants.alignY[y < gridSideWidth ? 0 : 2]);
            return;
        }

        // Middle box
        let revX = gridWidth - x,
            horizontal = true;

        if (x === y || revX === y) {
            // Click on line between sides, so center whatever isn't centered yet
            let props = this.props,
                xCentered = props.x === constants.alignX[1],
                yCentered = props.y === constants.alignY[1];

            if (xCentered !== yCentered) {
                // Center remaining coordinate
                this.onChange(yCentered, constants[yCentered ? 'alignX' : 'alignY'][1]);
                return;
            }
        }

        if (x > y) {
            // top or right
            if (revX > y) {
                // top
                horizontal = false;
            }
        } else {
            // bottom or left
            if (revX < y) {
                horizontal = false;
            }
        }
        this.onChange(horizontal, constants[horizontal ? 'alignX' : 'alignY'][1]);
    }
}

export default AlignInput;
