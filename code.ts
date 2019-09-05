(function() {
  var lastParent = null;

  function addIcon(icon, svg) {
    var node, parent, x, y;

    if (typeof svg !== 'string') {
      return;
    }

    // Add node
    console.log('Iconify: importing SVG:', svg);
    node = figma.createNodeFromSvg(svg);
    if (!node) {
      return;
    }

    // Change name
    node.name = icon.prefix + (icon.prefix.indexOf('-') === -1 ? '-' : ':') + icon.name;

    // Move it to currently selected item
    if (!figma.currentPage) {
      return;
    }

    parent = null;
    if (figma.currentPage.selection.length) {
      parent = figma.currentPage.selection[0];
      switch (parent.type) {
        case 'GROUP':
        case 'PAGE':
          break;

        case 'FRAME':
          if (parent.parent.type === 'PAGE') {
            // Frame with parent group should be parent for icon, unless its another icon
            if (parent.name.indexOf('-') !== -1 || parent.name.indexOf(':') !== -1) {
              parent = parent.parent;
            }
            break;
          }
          parent = parent.parent;
          break;

        default:
          parent = parent.parent;
      }
    }

    // Move icon to middle of selected group
    console.log('Iconify debug: moving icon to middle of selected group');
    if (parent && parent.type !== 'PAGE' && parent !== node.parent) {
      if (!lastParent || lastParent.node !== parent) {
        lastParent = {
          node: parent,
          offset: 0
        };
      }

      // Move to top left corner
      switch (parent.type) {
        case 'FRAME':
          x = 0;
          y = 0;
          break;

        default:
          x = parent.x;
          y = parent.y;
      }
      node.x = x;
      node.y = y;

      if (parent.width > node.width) {
        x = Math.floor(parent.width / 2 - node.width);
        x += lastParent.offset;
        node.x += x;
        lastParent.offset += node.width;
      }

      // Change parent node
      console.log('Iconify debug: changing parent node');
      parent.insertChild(parent.children.length, node);
    } else {
      // Move icon to middle of viewport
      console.log('Iconify debug: moving to middle of viewport');
      node.x = Math.round(figma.viewport.center.x - node.width);
      node.y = Math.round(figma.viewport.center.y - node.height);
    }

    // Select node
    console.log('Iconify debug: changing selection');
    figma.currentPage.selection = [node];
  }

  figma.showUI(__html__, {
    width: 800,
    height: 800
  });
  
  figma.ui.onmessage = msg => {
    switch (msg.event) {
      case 'cancel':
        figma.closePlugin();
        return;
  
      case 'submit2':
        figma.closePlugin();
  
      case 'submit':
        addIcon(msg.icon, msg.svg);
  
    }
  };
})();
