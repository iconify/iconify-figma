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

const Storage = require('./storage');

/**
 * Get Storage instance for phrases
 *
 * @param {string} instance Search instance
 * @return {Storage}
 */
module.exports = instance => {
    let result = new Storage({
        loading: {
            ui: 'Loading...',
        },
        crumbs: {
            collections: 'Return to collections list',
            collection: 'Return to {name}',
            search: 'Return to search results',
        },
        search: {
            placeholder: 'Search all icons',
            placeholderNamed: 'Search {name}',
            placeholderCollections: 'Filter collections',
            'placeholder-recent': 'Search recent icons',
            button: 'Find Icons',
            'button-named': 'Search',
            reset: 'Clear Search',
            title: 'Search all icons:',
            titleNamed: 'Search {name}:',
            'title-recent': 'Search recent icons:',
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
            'size-list': '{width} x {height}',
            'header-search-more': 'Displaying {count} icons (click second page to load more results):',
            'header-search-full': 'Displaying {count} icons:',
            'header-search-max': 'Too many search results. Showing only first {count} icons:',
            'header-search-0': 'No icons to display.',
            'header-search-1': 'Displaying 1 icon:',
            'header-count': 'Displaying {count} icons:',
            'header-count-0': 'No icons to display.',
            'header-count-1': 'Displaying 1 icon:',
            'header-empty-filter': 'No matches found.',
            'header-custom-recent-0': 'Recent icons list is empty. Icons will be automatically added here when you import Iconify icons.',
            mode: 'Change layout',
            'delete-recent': 'Remove'
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
        'collection-info': {
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
            'import-options': 'Import options:',
        },
    });

    if (instance.params && instance.params.phrases) {
        result.merge(instance.params.phrases);
    }

    return result;
};
