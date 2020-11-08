This is a development version!

Unlike version 2 that was built with React, this version is built with Svelte. Plug-in is based on [Iconify Icon Finder](https://github.com/iconify/icon-finder). Using shared code base with other icon pickers makes it easier to maintain plug-in.

Currently, this plug-in does not work. UI is working, you can see it by building plug-in (run `npm run build`) and opening demo/index.html in browser. If you want a working version, use plug-in from master branch of this repository.

# Iconify plug-in for Figma

Import Material Design Icons, FontAwesome, Jam Icons, EmojiOne, Twitter Emoji and many other icons (more than 60 icon sets containing over 50,000 icons) to Figma document as vector shapes.

## What is Iconify?

Iconify is a new unified icons framework. It is designed to replace outdated glyph fonts with modern JavaScript SVG framework
and offer a massive choice of icons. Unlike fonts, Iconify only loads icons used on pages, so you can use icons from FontAwesome,
Material Design Icons, Firefox Emoji and more on a web page without loading many fonts. It is fast and very easy to use.

See [https://iconify.design/](https://iconify.design/) for details.

In addition to SVG framework script, Iconify is available as React component, Angular component and soon will be available as Vue component.

See [https://github.com/iconify/iconify-react](https://github.com/iconify/iconify-react) and [https://github.com/iconify/iconify-angular](https://github.com/iconify/iconify-angular)

## What can Figma plug-in do?

Figma plug-in offers an easy way to import icons to a project.

You can browse and search icon sets directly from Figma. No need to copy/paste icons - plug-in will import icons you select.

In the future, Figma plug-in will be able to publish icons directly to Iconify, so it would take only 1 simple step from designing an icon to using it on a website. However that is a long term goal that requires a massive amount of development, so hopefully, it will be implemented by the end of 2019.

## Installation

In Figma on dashboard select "Plugins", "Browse all plugins", search for "Iconify". Click "Install".

## Usage

In Figma select main menu -> Plugins -> Iconify

Browse or search icons, select any icon, click the "Import" button or drag icon to Figma document. Plug-in will import icon to your current project.

## Screenshots

Collections list:

![Iconify for Figma - browse collections](https://iconify.github.io/iconify-figma/screenshots/collections.png)

Searching icons:

![Iconify for Figma - search results](https://iconify.github.io/iconify-figma/screenshots/search.png)

Browsing Material Design icons:

![Iconify for Figma - browsing icons set](https://iconify.github.io/iconify-figma/screenshots/collection.png)

Browsing IonIcons in compact mode:

![Iconify for Figma - compact mode](https://iconify.github.io/iconify-figma/screenshots/compact.png)

Drag and drop:

![Iconify for Figma - drag and drop](https://iconify.github.io/iconify-figma/screenshots/drag-drop.png)

Recent icons:

![Iconify for Figma - recent icons](https://iconify.github.io/iconify-figma/screenshots/recent.png)

Paste SVG:

![Iconify for Figma - paste SVG](https://iconify.github.io/iconify-figma/screenshots/paste.png)

## Drag and drop

Due to Figma plug-in system limitations, drag and drop is approximate.
Figma does not support drag and drop from plugin UI, so plugin approximates drop location from mouse events, which is not precise.

Because of that icon might be dropped a few pixels off target. To maximize chances of dropping icon to correct location, zoom in to correct frame or use the "Import" button instead of drag and drop.

## Paste SVG

Paste SVG function can extract SVG from data URI (you can keep "url" part), such as

```
url("data:image/svg+xml,%3Csvg fill='none' height='128' viewBox='0 0 32 128' width='32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-rule='evenodd' fill-rule='evenodd'%3E%3Cpath d='m12 12v8h8v-1h-3c0-2.2091-1.7909-4-4-4v-3zm1 4v3h3c0-1.6569-1.3431-3-3-3z' fill='%23000' fill-opacity='.8'/%3E%3Cpath d='m12 44v8h8v-1h-3c0-2.2091-1.7909-4-4-4v-3zm1 4v3h3c0-1.6569-1.3431-3-3-3z' fill='%23000' fill-opacity='.3'/%3E%3Cpath d='m12 76v8h8v-1h-3c0-2.2091-1.7909-4-4-4v-3zm1 4v3h3c0-1.6569-1.3431-3-3-3z' fill='%2318a0fb'/%3E%3Cpath d='m12 108v8h8v-1h-3c0-2.209-1.7909-4-4-4v-3zm1 4v3h3c0-1.657-1.3431-3-3-3z' fill='%23fff'/%3E%3C/g%3E%3C/svg%3E")
```

making it easy to paste background images from the browser's developer tools.

# Development version

To install the Figma plug-in from the repository you need to build it.

The first build plugin using `npm run build`, then open Figma, in menu select Plugins -> Development -> New Plugin. Click "Link existing plugin", navigate to manifest.json

Build modes:

-   `npm run build` - build production code. The output is stored in "dist".
-   `npm run dev` - build development code. The output is stored in "dist". Change debug stuff in ui/plugin-ui.js (see conditional statements that check process.env.SEARCH_DEV).
-   `npm run watch` - same as "dev", but also watches files for changes and automatically rebuilds files.
-   `npm run start` - debug UI without Figma. Creates web server on http://localhost:8080/ and shows UI. Change UI configuration in ui/dev-ui.js
-   `npm run test` - test Icon Finder core.

# Custom builds

To create custom build you need to change plug-in hash and name in manifest.json. This is enough for Figma to treat plug-in as a separate plug-in, so it won't share configuration with Iconify plug-in.

This plug-in can be limited to one collection, making it easy to create custom plug-ins for collections. To set collection, add parameter "prefix" in ui/plugin-ui.js and ui/dev-ui.js. Code is already there, you only need to uncomment it and set to correct values.

You can disable any menu sections that you do not need in `ui/src/components/header/navigation.jsx`. Just comment out what you do not need. In the "About/GitHub" menu please keep information about Iconify project and author. You can add your information about your icon set as well.

# License

Iconify Icon Finder is dual-licensed under Apache 2.0 and GPL 2.0 license. You may select, at your option, one of the above-listed licenses.

`SPDX-License-Identifier: Apache-2.0 OR GPL-2.0`

Iconify plug-in for Figma is based on Iconify Icon Finder and shares the same license as Icon Finder.

© 2019 - 2020 Vjacheslav Trushkin
