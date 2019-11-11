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

const iconObject = require('../objects/icon');

/*

Source format (collection block):

prefix: string
total: number
title: string
info: object (collection data)
uncategorized: Array, icon names without prefix
categories: object
    [category]: Array, icon names without prefix
themes: object, optional
    [key]: object
        title: string
        suffix/prefix: string

Converted (collection block):

prefix: string
title: string
total: number
author: object
    name: string
    url: string
license: object
    title: string
    id: string
    url: string
icons: Array of objects:
    prefix: collection prefix
    name: icon name
    tag: tag (category)
    themePrefix: prefix
    themeSuffix: suffix
    (todo) grid: grid size
tags: Array of tags (titles), empty string at the end if there are icons without tags
themePrefixes: Array of prefixes (titles), empty string at the end if there are icons without prefixes
themeSuffixes: Array of suffixes (titles), empty string at the end if there are icons without suffixes
(todo): grids: Array of grid sizes (strings), empty string at the end of there are icons without valid grid


Converted info block:

prefix: string
title: string
total: number
author: object
    name: string
    url: string
license: object
    title: string
    id: string
    url: string

 */

let functions = {
    /**
     * Convert info block
     *
     * @param source
     * @param [prefix]
     * @return {*}
     */
    convertInfo: (source, prefix) => {
        let newItem = Object.create(null);

        if (typeof prefix === 'string') {
            newItem.prefix = prefix;
        }

        Object.keys(source).forEach(key => {
            let value = source[key];
            switch (key) {
                case 'author':
                    if (typeof value === 'string') {
                        if (newItem.author === void 0) {
                            newItem.author = Object.create(null);
                        }
                        newItem.author.name = value;
                    } else if (typeof value === 'object') {
                        newItem[key] = Object.assign({}, value);
                    }
                    return;

                case 'url':
                    if (newItem.author === void 0) {
                        newItem.author = Object.create(null);
                    }
                    newItem.author.url = value;
                    return;

                case 'license':
                    if (typeof value === 'string') {
                        if (newItem.license === void 0) {
                            newItem.license = Object.create(null);
                        }
                        newItem.license.title = value;
                    } else if (typeof value === 'object') {
                        newItem[key] = Object.assign({}, value);
                    }
                    return;

                case 'licenseURL':
                    if (newItem.license === void 0) {
                        newItem.license = Object.create(null);
                    }
                    newItem.license.url = value;
                    return;

                case 'licenseID':
                    if (newItem.license === void 0) {
                        newItem.license = Object.create(null);
                    }
                    newItem.license.id = value;
                    return;

                case 'name':
                    newItem.title = value;
                    return;

                default:
                    newItem[key] = value;
            }
        });
        return newItem;
    },

    /**
     * Convert collection list from API data
     *
     * @param {object} source
     * @return {{prefix: string, title: string, total: number, author: object, license: object, icons: Array, tags: null|Array, themePrefixes: null|Array, themeSuffixes: null|Array}}
     */
    convert: source => {
        let info = source.info ? functions.convertInfo(source.info) : null,
            prefix = source.prefix;

        let result = {
            prefix: prefix,
            title: source.info && source.info.title !== void 0 ? source.info.title : source.title,
            total: source.info && source.info.total ? source.info.total : source.total,
            author: info ? info.author : null,
            license: info ? info.license : null,
            icons: [],
            tags: null,
            themePrefixes: null,
            themeSuffixes: null
        };

        // Check for tags/categories
        let tags = source.categories ? Object.keys(source.categories) : [],
            hasTags = tags.length > 0,
            hasUncategorized = source.uncategorized && source.uncategorized.length > 0;

        // Find all icons
        let icons = Object.create(null);
        if (hasTags) {
            tags.forEach(tag => {
                source.categories[tag].forEach(name => {
                    if (icons[name] === void 0) {
                        icons[name] = iconObject({
                            prefix: prefix,
                            name: name,
                            tag: tag
                        });
                    } else {
                        icons[name].tags.push(tag);
                    }
                });
            });
        }
        if (hasUncategorized) {
            source.uncategorized.forEach(name => {
                if (icons[name] === void 0) {
                    let props = {
                        prefix: prefix,
                        name: name
                    };
                    if (hasTags) {
                        props.tag = '';
                    }
                    icons[name] = iconObject(props);
                }
            });
            if (hasTags) {
                tags.push('');
            }
        }

        // Add characters
        if (source.chars) {
            Object.keys(source.chars).forEach(char => {
                let name = source.chars[char];
                if (icons[name] !== void 0) {
                    if (icons[name].chars === void 0) {
                        icons[name].chars = [];
                    }
                    icons[name].chars.push(char);
                }
            });
        }

        // Add aliases
        if (source.aliases) {
            Object.keys(source.aliases).forEach(alias => {
                let name = source.aliases[alias];
                if (icons[name] !== void 0) {
                    if (icons[name].aliases === void 0) {
                        icons[name].aliases = [];
                    }
                    icons[name].aliases.push(alias);
                }
            });
        }

        // Convert icons to sorted array
        let iconsList = [];
        Object.keys(icons).sort((a, b) => a.localeCompare(b)).forEach(key => {
            iconsList.push(icons[key]);
        });
        icons = iconsList;

        // Check tags
        if (tags.length > 1) {
            result.tags = tags;
        } else if (hasTags) {
            icons.forEach(icon => {
                delete icon.tags;
            });
        }

        // Add themes
        let themePrefixes = [],
            themeSuffixes = [];

        if (source.themes !== void 0) {
            Object.keys(source.themes).forEach(key => {
                let theme = source.themes[key],
                    match, length;

                if (theme.prefix !== void 0) {
                    themePrefixes.push(theme.title);
                    match = theme.prefix;
                    icons.forEach(icon => {
                        if (icon.name.slice(0, match.length) === match) {
                            icon.themePrefix = theme.title;
                        }
                    });
                }

                if (theme.suffix !== void 0) {
                    themeSuffixes.push(theme.title);
                    match = theme.suffix;
                    length = 0 - match.length;
                    icons.forEach(icon => {
                        if (icon.name.slice(length) === match) {
                            icon.themeSuffix = theme.title;
                        }
                    });
                }
            });

            // Check for icons without theme
            if (themePrefixes.length) {
                let missing = false;
                icons.forEach(icon => {
                    if (icon.themePrefix === null) {
                        icon.themePrefix = '';
                        missing = true;
                    }
                });
                if (missing) {
                    themePrefixes.push('');
                }

                if (themePrefixes.length > 1) {
                    result.themePrefixes = themePrefixes;
                } else {
                    icons.forEach(icon => delete icon.themePrefix);
                }
            }

            if (themeSuffixes.length) {
                let missing = false;
                icons.forEach(icon => {
                    if (icon.themeSuffix === null) {
                        icon.themeSuffix = '';
                        missing = true;
                    }
                });
                if (missing) {
                    themeSuffixes.push('');
                }

                if (themeSuffixes.length > 1) {
                    result.themeSuffixes = themeSuffixes;
                } else {
                    icons.forEach(icon => delete icon.themeSuffix);
                }
            }
        }

        result.icons = icons;

        return result;
    }
};

module.exports = functions;
