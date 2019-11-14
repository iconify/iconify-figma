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

module.exports = {
    loading: 'Loading...',
    navigation: {
        notavailable: 'This menu is not available yet.',
        menu: 'Menu',
        import: 'Import Icons',
        about: 'About / GitHub',
        options: 'Options',
        importOptions: 'Import',
        exportOptions: 'Export',
        reset: 'Reset',
        importIconify: 'Iconify',
        importSVG: 'Paste SVG',
        importFont: 'Font',
        recent: 'Recent',
        bookmarks: 'Bookmarks',
        aboutMain: 'About',
        pluginRepo: 'Plug-in Repository',
        support: 'Support',
        iconifyRepo: 'Iconify for HTML',
        reactRepo: 'Iconify for React',
    },
    errors: {
        noIconsFound: 'No icons found.',
        noIconsFoundTip: 'Try looking for something that could be part of icon name, such as "home", "arrow", "alert".',
        recentLimit: 'Recent icons list is full. Oldest icons will be removed from list when new icons are added.',
        bookmarksLimit: 'Bookmarked icons list is full. Oldest icons will be removed from list when new icons are added.',
    },
    paste: {
        invalidSVG: 'Invalid SVG code',
        fontNotice: 'Looks like you are trying to import SVG font. Currently plug-in does not support importing fonts.',
        importButton: 'Import',
        clearButton: 'Clear',
        text1: 'Paste SVG to import it to Figma document:',
        text2: 'You can also paste "data:image/svg+xml" URI and plugin will try to decode it.',
        foreignObject: 'SVG contains dangerous HTML code.',
    },
    crumbs: {
        collections: 'Return to collections list',
        collection: 'Return to {name}',
        search: 'Return to search results',
    },
    search: {
        placeholder: 'Search all icons',
        namedPlaceholder: 'Search {name}',
        collectionsPlaceholder: 'Filter collections',
        recentPlaceholder: 'Search recent icons',
        button: 'Find Icons',
        namedButton: 'Search', // 'Search {name}',
        reset: 'Clear Search',
        title: 'Search all icons:',
        namedTitle: 'Search {name}:',
        recentTitle: 'Search recent icons:',
    },
    filters: {
        uncategorized: 'Uncategorized',
        collections: 'Filter search results by icon set:',
        tags: 'Filter by tag:',
        themePrefixes: 'Icon type:',
        themeSuffixes: 'Icon type:',
    },
    collections: {
        empty: 'No matching icon sets found.',
        by: 'by ',
    },
    icons: {
        name: '{name}',
        size: 'Size: {width} x {height}',
        tags: 'Tags: {tags}',
        palette: 'Palette: {palette}',
        colorless: 'colorless',
        colors: 'has palette',
        loading: 'Loading...',
        sizeList: '{width} x {height}',
        headerSearch: {
            more: 'Displaying {count} icons (click second page to load more results):',
            full: 'Displaying {count} icons:',
            max: 'Too many search results. Showing only first {count} icons:',
            '0': 'No icons to display.',
            '1': 'Displaying 1 icon:',
        },
        headerCount: {
            default: 'Displaying {count} icons:',
            '0': 'No icons to display.',
            '1': 'Displaying 1 icon:',
        },
        headerEmptyFilter: 'No matches found.',
        headerCustom: {
            recent0: 'Recent icons list is empty. Icons will be automatically added here when you import Iconify icons.',
        },
        mode: 'Change layout',
        delete: 'Remove',
    },
    pagination: {
        more: 'Find more icons',
        first: 'First page',
        prev: 'Previous page',
        next: 'Next page',
        last: 'Last page',
    },
    parent: {
        search: 'Return to search results for "{keyword}"',
        collection: 'Return to {title}',
        collections: 'Return to icon sets list',
        generic: 'Return to previous page',
    },
    collectionInfo: {
        total: 'Number of icons:',
        height: 'Height of icons:',
        author: 'Author:',
        license: 'License:',
        palette: 'Palette:',
        colorless: 'Colorless',
        colorful: 'Has colors',
        link: 'Show all icons',
    },
    footer: {
        submit: 'Import Icon',
        close: 'Close Plugin',
        color: 'Color',
        height: 'Height',
        rotate: 'Rotate',
        flip: 'Flip',
        hFlip: 'Horizontal',
        vFlip: 'Vertical',
        customize: 'Customize icon:',
        code: 'How to use icon:',
        nodeOptions: 'Parent layer and alignment:',
        nodeOptionsPage: 'Parent layer:',
        parentNode: 'Select parent node:',
        htmlCode1: '1. Add Iconify script to your page:',
        htmlCode2: '2. Use icon placeholder where you want to show icon (similar to icon fonts):',
        htmlCodeText: 'Change icon size using css (similar to icon fonts):',
        htmlCodeTextColor: 'Change icon size and color using css (similar to icon fonts):',
        htmlCode3Start: 'For more details see ',
        htmlCode3Link: 'Iconify documentation',
        htmlCode3End: '.',
        reactCode1: '1. Install components:',
        reactCode2: '2. Import icon component and icon data:',
        reactCode3: '3. Use it in your code:',
        reactCode4Start: 'For more details see ',
        reactCode4Link: 'Iconify for React repository',
        reactCode4End: '.',
        aboutCollection: 'About {title}',
    },
    alignX: {
        left: 'Left',
        center: 'Center',
        right: 'Right',
    },
    alignY: {
        top: 'Top',
        middle: 'Middle',
        bottom: 'Bottom',
    },
};
