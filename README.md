# Iconify plug-in for Figma

Import Material Design Icons, FontAwesome, Jam Icons, EmojiOne, Twitter Emoji and many other icons (more than 150 icon sets containing over 200,000 icons) to Figma document as vector shapes.

## Pre-release

This is a pre-release branch for version 3 of plug-in.

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

This is a preview version. 

Functions that do not work yet:
- Various pages (About, Recent icons)
- Color picker (icons are imported as black for now)

### New features

Version 3 has been completely rewritten. It includes many new shiny features, which should all work in development preview.

### New UI

Plugin has completely new UI.

Many Figma users have small monitors, plugin takes precious space. 
UI has been re-designed to fit as much information as possible in a small plugin window.

### Icon sets

[Iconify for Figma - icon sets](https://iconify.github.io/iconify-figma/samples/icon-sets.png)

Icon sets list is shorter, but offers a lot more:
- Hints when you hover icon set, showing various details, including extended license information.
- Favorite and recent icon sets. You can mark any icon set as favorite to access it quicker.
- Advanced filters. You can filter icon sets by category, grid, license, license details.

[Iconify for Figma - icon sets filters](https://iconify.github.io/iconify-figma/samples/filters.png)

### Icon set

[Iconify for Figma - icon sets filters](https://iconify.github.io/iconify-figma/samples/icon-set.png)

Icon set page now has:
- Advanced license details: attribution, commercial use.
- You can add icon set to favorite icon sets list to quickly access it.
- Scrolling for icons. No more pagination (though it is available if you prefer to click pages).
- You can select multiple icons. To enable multi-select, click "Select multiple icons" box.

[Iconify for Figma - icon sets filters](https://iconify.github.io/iconify-figma/samples/multi-select.png)

### Search

[Iconify for Figma - icon sets filters](https://iconify.github.io/iconify-figma/samples/search.png)

Search results feature:
- Infinite scroll for icons, same as in icon set view. It is not typical slow infinite scroll, it is very fast and renders only icons that are visible.
- License information for each icon.

### Drag and drop

Drag and drop has been redesigned. It is now more precise, dropping icon to correct layer.

There are some caveats though:
- Cannot drop icon to component instance: Figma plugin system limitation. Must drop it to main component.
- If layer has auto-layout, icon will be imported as first item in frame, not necessary where you drop it.

## Feedback

Feedback is very welcome.

Please open issues at this repository if:
- You think this version is missing a critical feature that older version used to have.
- You have a suggestion.
- You found something that does not feel right, which might be a bug or bad design.

## Source code

Source code for this version is not available yet.

