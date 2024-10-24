# Iconify plug-in for Figma

Import Material Design Icons, FontAwesome, Jam Icons, EmojiOne, Twitter Emoji and many other icons (more than 150 icon sets containing over 200,000 icons) to Figma document as vector shapes.

## Pre-release

This is a pre-release branch for version 4 of plug-in.

It contains built files that you can use in Figma.

## Usage

1. Clone or download this repository
2. Open Figma
3. In menu go to Plugins -> Development -> Manage plugins in development
4. Click "+" icon to create a new plugin, select option "Import plugin from manifest"
5. Select `manifest.json` from this repository.

This will install plugin to your Figma app.

To run it, go to Plugins -> Development, select "Iconify Dev".

## Functionality

This plugin is fully functional. Everything should work correctly.

However, it is currently available only here. Figma community shows old version.

### New features

Version 4 has been completely rewritten. It includes many new shiny features, which should all work in development preview.

### New UI

Plugin has completely new UI.

Many Figma users have small monitors, plugin takes precious space.
UI has been re-designed to fit as much information as possible in a small plugin window.

### Redesign attempt 2

Initial redesign was a failure. It resulted in very bad UX, making things worse.

New version of plugin was live for only 3 days before it was restored to old version.

So after many months of hard work, UI has been redesigned again.

Screenshots below show new redesigned UI, not initial mess.

### Icon sets

![Iconify for Figma - icon sets](https://iconify.github.io/iconify-figma/samples/icon-sets-v2.png)

Icon sets list is shorter, but offers a lot more:

-   Hints when you hover icon set, showing various details, including extended license information.
-   Favorite and recent icon sets. You can mark any icon set as favorite to access it quicker.
-   Advanced filters. You can filter icon sets by category, grid, license, license details.
-   Custom lists of icon sets.

### Icon set

![Iconify for Figma - icon set](https://iconify.github.io/iconify-figma/samples/icon-set-v2.png)

Icon set page now has:

-   Advanced license details: attribution, commercial use.
-   Scrolling for icons. No more pagination (though it is available if you prefer to click pages).
-   You can select multiple icons. To enable multi-select, click "Select multiple icons" box.
-   Quick import for icons. Click menu (3 dots icon) button for any icon, you'll see buttons to quickly import it. Drag/drop is also supported, so you can use whatever you prefer.

![Iconify for Figma - multi-select](https://iconify.github.io/iconify-figma/samples/multi-select-v2.png)

### Search

![Iconify for Figma - search results](https://iconify.github.io/iconify-figma/samples/search-v2.png)

Search results feature:

-   Search is now shown on all pages, making it easy to access at all times.
-   If you are viewing filtered icon sets (such as filtered by category) or custom icon sets list (favorite, recent or any other list), you can search only icon sets in that list.
-   Infinite scroll for icons, same as in icon set view. It is not typical slow infinite scroll, it is very fast and renders only icons that are visible.
-   License information for each icon.

### Drag and drop

Drag and drop has been redesigned. It is now more precise, dropping icon to correct layer.

There are some caveats though:

-   Cannot drop icon to component instance: Figma plugin system limitation. Must drop it to main component.
-   If layer has auto-layout, icon will be imported as first item in frame, not necessary where you drop it.

### Color styles

Plugin now supports Figma color styles.

Color styles are shown in color picker. When importing icon, if color style is selected, it will be applied to icon.

![Iconify for Figma - color styles](https://iconify.github.io/iconify-figma/samples/color-styles-v2.png)

Behavior:

-   Works when importing icon, works when using drag/drop.
-   When replacing icon, color value is ignored. Instead, plugin will reuse color or color style from old icon.
-   In Figma, plugins can find only local styles. Shared styles from other documents (remote styles) are not available. However, when selecting a layer, plugin can see styles that are used in that layer, including remote style. Iconify plugin checks selected layers for remote styles, so if you want to use a remote style, select any layer that uses it and it will appear in plugin's color picker.

## Feedback

Feedback is very welcome.

Please open issues at this repository if:

-   You think this version is missing a critical feature that older version used to have.
-   You have a suggestion.
-   You found something that does not feel right, which might be a bug or bad design.

## Source code

Source code for this version is not available yet.
