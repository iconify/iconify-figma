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

const functions = {
    /**
     * Get wrapper class name
     *
     * @param {object} props
     * @param {string} name Block name
     * @return {string}
     */
    wrapperClass: (props, name) => 'plugin-wrapper plugin-wrapper--' + name,

    /**
     * Get wrapper class name for icons block
     *
     * @param {object} props
     * @return {string}
     */
    iconsWrapperClass: props => {
        let layout = props.app.layout[props.app.page],
            list = layout ? (layout.forceList || layout.list) : true;

        return 'plugin-wrapper plugin-wrapper--icons plugin-wrapper--icons--' + (list ? 'list' : 'grid') + (props.view.blocks.pagination.length ? '' : ' plugin-wrapper--icons--empty');
    },

    /**
     * Get key for icons block. Change it for each page to reset scrollbar position
     *
     * @param {object} props
     * @return {string}
     */
    iconsBlockKey: props => {
        let pagination = props.view.blocks.pagination;
        return pagination.length ? 'icons-' + pagination.page + '-' + pagination.length : 'icons';
    },
};

export default functions;
