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

import React from 'react';

function Arrow() {
    return <path d="M3.646 5.354l-3-3 .708-.708L4 4.293l2.646-2.647.708.708-3 3L4 5.707l-.354-.353z" fillRule="evenodd" fill="currentColor" stroke="none" />;
}

function Arrows() {
    return <path fill="currentColor" fillRule="nonzero" d="M5.5 0l3 3-1 1L6 2.5v7L7.5 8l1 1-3 3-3-3 1-1L5 9.5v-7L3.5 4l-1-1z"/>;
}

const classPrefix = 'plugin-icon--';

function IconDecoration(props) {
    let {name, ...params} = props;

    // For adding new icons: replace attributes with camelCase: '-rule' with 'Rule', '-opacity' with 'Opacity' (or remove opacity)
    switch (name) {
        case 'search':
            return <svg width="11" height="11" viewBox="0 0 11 11" xmlns="http://www.w3.org/2000/svg" className={classPrefix + name}>
                <path fillRule="evenodd" clipRule="evenodd" d="M6.45285 7.15991C5.77551 7.68652 4.92438 8 4 8C1.79086 8 0 6.20923 0 4C0 1.79077 1.79086 0 4 0C6.20914 0 8 1.79077 8 4C8 4.92432 7.68643 5.77563 7.15991 6.45288L10.3535 9.64648L9.64645 10.3535L6.45285 7.15991ZM7 4C7 5.65674 5.65686 7 4 7C2.34314 7 1 5.65674 1 4C1 2.34326 2.34314 1 4 1C5.65686 1 7 2.34326 7 4Z" fill="currentColor"/>
            </svg>;

        case 'reset':
            return <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" className={classPrefix + name}>
                <path d="M6 5.293l4.789-4.79.707.708-4.79 4.79 4.79 4.789-.707.707-4.79-4.79-4.789 4.79-.707-.707L5.293 6 .502 1.211 1.21.504 6 5.294z" fillRule="nonzero" fill="currentColor" stroke="none" />
            </svg>;

        case 'menu':
            return <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" className={classPrefix + name}>
                <path d="M16 13H2v1h14v-1zm0-5H2v1h14V8zm0-5H2v1h14V3z" fillRule="nonzero" fill="currentColor" stroke="none" />
            </svg>;

        case 'arrow-down':
            return <svg width="8" height="7" viewBox="0 0 8 7" xmlns="http://www.w3.org/2000/svg" className={classPrefix + name}>
                <Arrow/>
            </svg>;

        case 'arrow-left':
            return <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" style={{transform: 'rotate(90deg)'}} className={classPrefix + name}>
                <Arrow/>
            </svg>;

        case 'arrow-up':
            return <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" style={{transform: 'rotate(180deg)'}} className={classPrefix + name}>
                <Arrow/>
            </svg>;

        case 'arrow-right':
            return <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" style={{transform: 'rotate(270deg)'}} className={classPrefix + name}>
                <Arrow/>
            </svg>;

        case 'layout-grid':
            return <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" className={classPrefix + name}>
                <path fill="currentColor" d="M2 2h2v2H2zM6 2h2v2H6zM10 2h2v2h-2zM2 6h2v2H2zM6 6h2v2H6zM10 6h2v2h-2zM2 10h2v2H2zM6 10h2v2H6zM10 10h2v2h-2z"/>
            </svg>;

        case 'layout-list':
            return <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" className={classPrefix + name}>
                <path fill="currentColor" d="M2 2h10v2H2zM2 6h10v2H2zM2 10h10v2H2z"/>
            </svg>;

        case 'nav-menu':
            return <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className={classPrefix + name}>
                <path stroke="currentColor" fill="none" d="M1 2.5h14M1 7.5h14M1 12.5h14"/>
            </svg>;

        case 'trash':
            return <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className={classPrefix + name}>
                <path fillRule="evenodd" clipRule="evenodd" d="M15 9.5a1 1 0 00-1 1h4a1 1 0 00-1-1h-2zm4 1a2 2 0 00-2-2h-2a2 2 0 00-2 2h-3v1h1v10a2 2 0 002 2h6a2 2 0 002-2v-10h1v-1h-3zm1 1h-8v10a1 1 0 001 1h6a1 1 0 001-1v-10zm-6 7v-4h1v4h-1zm3 0v-4h1v4h-1z" fill="currentColor"/>
            </svg>;

        case 'ext-link':
            return <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" className={classPrefix + name}>
                <g fill="none" stroke="currentColor">
                    <path d="M8.5 7v3.5h-7v-7H5"/>
                    <path strokeLinecap="square" d="M10 2L5 7M6.5 1.5h4V5"/>
                </g>
            </svg>;

        case 'chevron-right':
            return <svg height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg" className={classPrefix + name}>
                <path d="m11 8-4-3v6z" fill="currentColor"/>
            </svg>;

        case 'angle':
            return <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" className={classPrefix + name}>
                <path d="M2 2v8h8V9H7a4 4 0 00-4-4V2H2zm1 4v3h3a3 3 0 00-3-3z" fill="currentColor" fillRule="evenodd"/>
            </svg>;

        case 'check':
            return <svg height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg" className={classPrefix + name}>
                <path clipRule="evenodd" d="m13.2069 5.20724-5.50002 5.49996-.70711.7072-.70711-.7072-3-2.99996 1.41422-1.41421 2.29289 2.29289 4.79293-4.79289z" fill="currentColor" fillRule="evenodd"/>
            </svg>;

        case 'arrows-vertical':
            return <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" className={classPrefix + name}>
                <Arrows />
            </svg>;

        case 'arrows-horizontal':
            return <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" style={{transform: 'rotate(90deg)'}} className={classPrefix + name}>
                <Arrows />
            </svg>;
    }

    return <span {...params}>Icon: {name}</span>;
}

export default IconDecoration;
