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

import SelectOptions from './select-options';
import Icon from '../icon-decoration';

class Select extends Component {
    constructor(props) {
        super(props);

        this.state = {
            opened: false
        };
    }

    render() {
        let props = this.props,
            state = this.state,
            className = 'plugin-input plugin-input--select' + (typeof props.className === 'string' ? ' ' + props.className : ''),
            wrapperClassName = 'plugin-select-container plugin-input-wrapper plugin-input-wrapper--select' + (typeof props.wrapperClassName === 'string' ? ' ' + props.wrapperClassName : ''),
            icon = null,
            value = props.value === void 0 || props.options[props.value] === void 0 ? '' : props.options[props.value];

        // Icon
        if (props.children) {
            // Icon is passed as child item, "iconType" property is set for icon name
            className += ' plugin-input--with-icon';
            if (typeof props.iconType === 'string') {
                className += ' plugin-input--with-icon--' + props.iconType;
                wrapperClassName += ' plugin-input-wrapper--' + props.iconType;
            }
            icon = <div className={'plugin-input-icon' + (props.iconType ? ' plugin-input-icon--' + props.iconType : '')}>{props.children}</div>;
        } else if (props.icon) {
            // Icon is passed as "icon" property
            className += ' plugin-input--with-icon plugin-input--with-icon--' + props.icon;
            wrapperClassName += ' plugin-input-wrapper--' + props.icon;
            icon = this._renderIcon(props.icon);
        }

        // Focused
        if (state.opened) {
            wrapperClassName += ' plugin-input-wrapper--select--focused';
        }

        // Generate attributes
        let attribs = {
            type: 'text',
            placeholder: props.placeholder,
            className: className,
            onFocus: this.toggleFocus.bind(this),
            value: value,
            onChange: () => {} // Useless, but fixes React notice
        };

        return <div className={wrapperClassName} ref={node => this.wrapper = node}>
            <input {...attribs} ref={input => this.input = input} />
            {icon}
            <span className="plugin-input-dropdown"><Icon name="arrow-down" /></span>
            {state.opened && <SelectOptions
                value={props.value}
                options={props.options}
                onChange={this._onSelect.bind(this)}
            />}
        </div>;
    }

    /**
     * Render icon
     *
     * @param {string} name
     * @return {*}
     */
    _renderIcon(name) {
        return <div className={'plugin-input-icon plugin-input-icon--' + name}><Icon name={name} /></div>
    }

    /**
     * Check other inputs for focus
     */
    componentDidMount() {
        this._focusEvent = this._handleEvent.bind(this, 'focusin');
        document.addEventListener('focusin', this._focusEvent);

        this._clickEvent = this._handleEvent.bind(this, 'click');
        document.addEventListener('click', this._clickEvent);
    }

    /**
     * Remove event listener
     */
    componentWillUnmount() {
        if (this._focusEvent !== void 0) {
            document.removeEventListener('focusin', this._focusEvent);
        }
        if (this._clickEvent !== void 0) {
            document.removeEventListener('click', this._clickEvent);
        }
    }

    /**
     * Handle DOM event
     *
     * @param {string} type
     * @param {*} event
     * @private
     */
    _handleEvent(type, event) {
        let target = event.target,
            state = this.state;

        if (this.wrapper.contains(target)) {
            // Focus on child node
            if (target.blur) {
                try {
                    target.blur();
                } catch (err) {
                }
            }
            if (!state.opened) {
                this.setState({
                    opened: true
                });
            }
            return;
        }

        // Other element was focused
        if (state.opened) {
            this.setState({
                opened: false
            });
        }
    }

    /**
     * Focus input
     *
     * @param {*} [event]
     */
    focus(event) {
        this._setOpened(true, event);
    }

    /**
     * Remove focus
     *
     * @param event
     */
    blur(event) {
        this._setOpened(false, event);
    }

    /**
     * Toggle focus
     *
     * @param {*} [event]
     */
    toggleFocus(event) {
        this._setOpened(!this.state.opened, event);
    }

    /**
     * Change focus
     *
     * @param opened
     * @param event
     * @private
     */
    _setOpened(opened, event) {
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        this.input.blur();
        this.setState({
            opened: opened
        });
    }

    /**
     * New value selected
     *
     * @param {*} value
     * @param {boolean} [temporary]
     * @private
     */
    _onSelect(value, temporary) {
        if (!temporary) {
            this.blur();
        }
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }
}

export default Select;
