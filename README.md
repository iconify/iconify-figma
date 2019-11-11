# Development notice

This is version 2.0.0-dev of Iconify plug-in for Figma. It is currently in development and might not work correctly (or not work at all).

To build plugin run `npm run build` after installing all dependencies.

For stable version of plug-in see "v1" branch of this repository.

# Iconify plug-in for Figma

Import Material Design Icons, FontAwesome, Jam Icons, EmojiOne, Twitter Emoji and many other icons (more than 50 icon sets containing over 40,000 icons) to Figma document as vector shapes.

## What is Iconify?

Iconify is new unified icons framework. It is designed to replace outdated glyph fonts with modern JavaScript SVG framework
and offer massive choice of icons. Unlike fonts, Iconify only loads icons used on pages, so you can use icons from FontAwesome,
Material Design Icons, Firefox Emoji and more on web page without loading many fonts. It is fast and very easy to use.

See [https://iconify.design/](https://iconify.design/) for details.

In addition to script, Iconify is available as React component, Angular component and soon will be available as Vue component. 

See [https://github.com/iconify/iconify-react](https://github.com/iconify/iconify-react) and [https://github.com/iconify/iconify-angular](https://github.com/iconify/iconify-angular)

## What can Figma plug-in do?

Figma plug-in offers easy way to import icons to project.

You can browse and search icon sets directly from Figma. No need to copy/paste icons - plug-in will import icons you select.

In future plug-in will be able to publish icons directly to Iconify, so it would take only 1 simple step from designing icon to using it on website. However that is a long term goal that requires massive amount of development, so hopefully it will be implemented by the end of 2019.

## Installation

In Figma on dashboard select "Plugins", "Browse all plugins", search for "Iconify". Click "Install".

## Usage

In Figma select main menu -> Plugins -> Iconify

Browse or search icons, select any icon, click "Import" button. Plug-in will import icon to your current project.

![Iconify for Figma - loading plugin](https://iconify.github.io/iconify-figma-plus/samples/opening_plugin.png)

## Screenshots

Big choice of "home" icons:
![Iconify for Figma - search results](https://iconify.github.io/iconify-figma-plus/samples/search1.png)
![Iconify for Figma - search results](https://iconify.github.io/iconify-figma-plus/samples/search2.png)

Browsing Material Design icons:
![Iconify for Figma - browsing icons set](https://iconify.github.io/iconify-figma-plus/samples/material-design.png)

Collections list:
![Iconify for Figma - browse collections](https://iconify.github.io/iconify-figma-plus/samples/collections.png)


## Development

There are 3 development modes: production, plugin dev, ui dev. They have separate entry points, but share same code. Commands to run them:
* production: `npm run build`
* plugin development: `npm run dev`
* ui development: `npm run start`

## License

Iconify Icon Finder is dual-licensed under Apache 2.0 and GPL 2.0 license. You may select, at your option, one of the above-listed licenses.

`SPDX-License-Identifier: Apache-2.0 OR GPL-2.0`

Iconify plug-in for Figma is based on Iconify Icon Finder and shares same license as Icon Finder.

© 2019 Vjacheslav Trushkin
