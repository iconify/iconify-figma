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

import ToggleOption from '../parts/options/toggle';
import InputOption from '../parts/options/input';
import SelectOption from '../parts/options/select';

const constants = require('../../data/const');
const phrases = require('../../data/phrases');

/**
 * Create options list from constants/phrases
 *
 * @param {string} name
 */
function makeOptions(name) {
    let results = {};
    constants[name].forEach(key => {
        results[key] = phrases[name] && phrases[name][key] !== void 0 ? phrases[name][key] : key.slice(0, 1).toUpperCase() + key.slice(1)
    });
    return results;
}

class OptionsContainer extends Component {
    render() {
        let props = this.props,
            options = props.container.options;

        return <div className="plugin-content plugin-content--page">
            <section>
                <h1>Layout</h1>
                <ToggleOption
                    id="ctrl_compact_layout"
                    value={options.compactLayout}
                    onChange={this._onChange.bind(this, 'compactLayout')}
                    text="Enable compact layout."
                />
            </section>
            <section>
                <h1>Drag and drop options</h1>
                <p className="plugin-hint">You can drag icons from plug-in to Figma instead of clicking Import button. Change options below to
                    change drag and drop behavior.</p>
                <ToggleOption
                    id="ctrl_customize_drop"
                    value={options.customizeDrop}
                    onChange={this._onChange.bind(this, 'customizeDrop')}
                    text="Apply icon customizations to icons drag and dropped icons."
                />
                <ToggleOption
                    id="ctrl_drop_to_frame"
                    value={options.dropToFrame}
                    onChange={this._onChange.bind(this, 'dropToFrame')}
                    text="Import to nearest frame instead of current page."
                />
            </section>
            <section>
                <h1>Import options</h1>
                <SelectOption
                    text="Select imported node:"
                    value={options.selectNodes}
                    options={makeOptions('selectNodes')}
                    placeholder={options.getDefaultValue('selectNodes')}
                    onChange={this._onChange.bind(this, 'selectNodes')}
                />
            </section>
            <section>
                <h1>Storage options</h1>
                <InputOption
                    text="Recent icons limit:"
                    value={options.storageLimit}
                    placeholder={options.getDefaultValue('storageLimit')}
                    onChange={this._onChange.bind(this, 'storageLimit')}
                    hint="Set to 0 to remove limit."
                />
            </section>
        </div>;
    }

    /**
     * Option was changed
     *
     * @param {string} name
     * @param {*} value
     * @private
     */
    _onChange(name, value) {
        let container = this.props.container,
            defaultValue = container.options.getDefaultValue(name);

        if (typeof value !== typeof defaultValue) {
            switch (typeof defaultValue) {
                case 'number':
                    value = value === '' ? defaultValue : parseInt(value);
                    if (isNaN(value)) {
                        return;
                    }
                    break;

                default:
                    return;
            }
        }

        container.options[name] = value;
        container.update();
    }
}

export default OptionsContainer;
