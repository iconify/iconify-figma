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
import { Parser } from 'expr-eval';

import Input from '../../parts/inputs/input';
import ColorInput from '../../parts/inputs/color-input';
import Select from '../../parts/inputs/select';
import IconButton from '../../parts/inputs/icon-button';
import OptionsPanel from '../../parts/options-panel';
import FooterBlock from './block';

const phrases = require('../../../data/phrases');
const lang = phrases.footer;

const deg = String.fromCharCode(176);
const rotationOptions = {
    0: '0' + deg,
    1: '90' + deg,
    2: '180' + deg,
    3: '270' + deg
};

class FooterOptions extends Component {
    /**
     * Render options
     *
     * @return {*}
     */
    render() {
        return <FooterBlock type="options" title={lang.customize}>
            {this.renderColorPicker()}
            {this.renderHeight()}
            {this.renderFlip()}
            {this.renderRotation()}
        </FooterBlock>;
    }

    /**
     * Render color picker
     *
     * @return {*}
     */
    renderColorPicker() {
        let props = this.props;

        if (!props.showColor) {
            return null;
        }

        let color = typeof props.transformations.color === 'string' ? props.transformations.color : '',
            active = color !== '';

        return <OptionsPanel type="color" title={lang.color} active={active}>
            <ColorInput className={active ? 'plugin-input--outlined' : ''} placeholder="#000" defaultColor="#000" value={color} onChange={this._changeColor.bind(this)} onTemporaryChange={this._changeColor.bind(this)} />
        </OptionsPanel>;
    }

    /**
     * Render height picker
     *
     * @return {*}
     */
    renderHeight() {
        let props = this.props,
            defaultHeight = props.sampleHeight,
            height = props.transformations.height,
            active = !!height;

        // icon="arrows-vertical"
        return <OptionsPanel type="height" title={lang.height} active={active}>
            <Input className={'plugin-input--number' + (active ? ' plugin-input--outlined' : '')} placeholder={defaultHeight} value={height} onChange={this._changeHeight.bind(this, true)} onTemporaryChange={this._changeHeight.bind(this, false)} />
        </OptionsPanel>;
    }

    /**
     * Render rotation
     *
     * @return {*}
     */
    renderRotation() {
        let props = this.props,
            value = props.transformations.rotate,
            active = value > 0;

        return <OptionsPanel type="rotation" title={lang.rotate} active={active}>
            <Select icon="angle" className={'plugin-input--angle' + (active ? ' plugin-input--outlined' : '')} placeholder={rotationOptions[0]} value={value} options={rotationOptions} onChange={this._changeRotation.bind(this)} />
        </OptionsPanel>;
    }

    /**
     * Render flip
     *
     * @return {*}
     */
    renderFlip() {
        let props = this.props,
            hFlip = props.transformations.hFlip,
            vFlip = props.transformations.vFlip;

        return <OptionsPanel type="flip" title={lang.flip} active={hFlip || vFlip}>
            <IconButton icon="arrows-horizontal" title={lang.hFlip} onClick={this._flipClicked.bind(this, 'hFlip')} active={hFlip} />
            <IconButton icon="arrows-vertical" title={lang.vFlip} onClick={this._flipClicked.bind(this, 'vFlip')} active={vFlip} />
        </OptionsPanel>;
    }

    /**
     * Change color
     *
     * @param value
     * @private
     */
    _changeColor(value) {
        this.props.onOptionChange('color', value);
    }

    /**
     * Change height
     *
     * @param {boolean} permanent
     * @param {string} value
     * @return {*}
     * @private
     */
    _changeHeight(permanent, value) {
        let numericValue;

        if (value.length) {
            try {
                numericValue = Parser.evaluate(value.replace(/px/gi, ''));
            } catch (err) {
                return permanent ? this.props.height : value;
            }

            // numericValue = parseFloat(value);
            if (isNaN(numericValue) || numericValue < 1) {
                return permanent ? this.props.height : value;
            }

            let str = '' + numericValue;
            if (permanent && str !== value) {
                value = str;
            }
        } else {
            numericValue = '';
        }

        this.props.onOptionChange('height', numericValue);

        return value;
    }

    /**
     * Change rotation
     *
     * @param {number} value
     * @private
     */
    _changeRotation(value) {
        this.props.onOptionChange('rotate', parseInt(value));
    }

    /**
     * Toggle flip
     *
     * @param {string} type
     * @param event
     * @private
     */
    _flipClicked(type, event) {
        if (event) {
            event.preventDefault();
        }

        let options = this.props.app.options;
        this.props.onOptionChange(type, !options[type]);
    }
}

export default FooterOptions;
