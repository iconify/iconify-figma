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
import Iconify from '@iconify/iconify';

import FooterBlock from './block';
import Disclosure from '../../parts/disclosure';
import DisclosureItem from '../../parts/disclosure-item';

const phrases = require('../../../data/phrases');
const lang = phrases.footer;

const activeClass = 'disclosure__item disclosure--expanded';
const inactiveClass = 'disclosure__item';

function camelCase(iconName) {
    let name = '';
    let parts = iconName.split('-');
    parts.forEach(function(part, index) {
        name += index ? part.slice(0, 1).toUpperCase() + part.slice(1) : part
    });
    if (name.charCodeAt(0) < 97 || name.charCodeAt(0) > 122) {
        // Not a-z - add "icon" at start
        name = 'icon' + name.slice(0, 1).toUpperCase() + name.slice(1);
    } else if (parts.length < 2) {
        // Add "Icon" to avoid reserved keywords
        name += 'Icon';
    }
    return name;
}

class FooterCode extends Component {
    render() {
        let props = this.props,
            section = props.app.footerCodeSection,
            app = props.app,
            name = props.iconName,
            icon = app.options.icon,
            transformations = props.transformations;

        let version = Iconify.getVersion(),
            majorVersion = version.split('.').shift();

        let htmlAttribs = [],
            reactAttribs = [];
        if (props.hasColor && transformations.color) {
            htmlAttribs.push(' style="color: ' + transformations.color + ';"');
            reactAttribs.push(' color="' + transformations.color + '"');
        }

        if (transformations.hFlip) {
            reactAttribs.push(' hFlip={true}');
            htmlAttribs.push(' data-flip="horizontal' + (transformations.vFlip ? ',vertical' : '') + '"');
        }
        if (transformations.vFlip) {
            reactAttribs.push(' vFlip={true}');
            if (!transformations.hFlip) {
                htmlAttribs.push(' data-flip="vertical"');
            }
        }

        if (transformations.rotate > 0) {
            reactAttribs.push(' rotate="' + (transformations.rotate * 90) + 'deg"');
            htmlAttribs.push(' data-rotate="' + (transformations.rotate * 90) + 'deg"');
        }

        // Generate HTML code
        let html = '<iconify-icon data-icon="' + name + '"' + htmlAttribs.join('') + '></iconify-icon>',
            html2 = '<iconify-icon data-icon="' + name + '" style="font-size: 24px;' + (props.hasColor ? ' color: red;' : '') + '"></iconify-icon>',
            script = '<script src="https://code.iconify.design/' + majorVersion + '/' + version + '/iconify.min.js"></script>';

        let reactInstall = 'npm install --save-dev @iconify/react @iconify/icons-' + icon.prefix,
            varName = camelCase(icon.name),
            reactImport1 = 'import { Icon, InlineIcon } from \'@iconify/react\';\n',
            reactImport2 = 'import ' + varName + ' from \'@iconify/icons-' + icon.prefix + '/' + icon.name + '\';',
            reactUsage = '<Icon icon={' + varName + '}' + reactAttribs.join('') + ' />';

        return <FooterBlock type="code" title={lang.code}>
            <Disclosure active={section} onToggle={this._onChangeSection.bind(this)}>
                <DisclosureItem key="html" title="HTML code">
                    {lang.htmlCode1}
                    <div className="plugin-code-sample">{script}</div>
                    {lang.htmlCode2}
                    <div className="plugin-code-sample">{html}</div>
                    <div className="plugin-code-sample">{html.replace('<iconify-icon', '<span class="iconify" data-inline="false"').replace('</iconify-icon>', '</span>')}</div>
                    {props.hasColor ? lang.htmlCodeTextColor : lang.htmlCodeText}
                    <div className="plugin-code-sample">{html2}</div>
                    <div className="plugin-code-sample">{html2.replace('<iconify-icon', '<span class="iconify" data-inline="false"').replace('</iconify-icon>', '</span>')}</div>
                    {lang.htmlCode3Start}<a href="https://iconify.design/docs/iconify-in-pages/" target="_blank">{lang.htmlCode3Link}</a>{lang.htmlCode3End}
                </DisclosureItem>
                <DisclosureItem key="react" title="React component">
                    {lang.reactCode1}
                    <div className="plugin-code-sample">{reactInstall}</div>
                    {lang.reactCode2}
                    <div className="plugin-code-sample">{reactImport1}<br />{reactImport2}</div>
                    {lang.reactCode3}
                    <div className="plugin-code-sample">{reactUsage}</div>
                    {lang.reactCode4Start}<a href="https://github.com/iconify/iconify-react" target="_blank">{lang.reactCode4Link}</a>{lang.reactCode4End}
                </DisclosureItem>
            </Disclosure>
        </FooterBlock>;
    }

    /**
     * Remember current section selection
     *
     * @param section
     * @private
     */
    _onChangeSection(section) {
        this.props.app.footerCodeSection = section;
    }
}

export default FooterCode;
