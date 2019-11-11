let debug = false;

figma.showUI(__html__, {
  width: 800,
  height: 800
});

figma.ui.onmessage = msg => {
  switch (msg.event) {
    case 'loaded':
      figma.ui.postMessage({
        event: 'show'
      });
      debug = msg.data;
      break;

    case 'close':
      figma.closePlugin();
      break;
  }
};
