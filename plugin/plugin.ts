figma.showUI(__html__, {
  width: 800,
  height: 800
});

figma.ui.onmessage = msg => {
  console.log('Got message from UI:', msg);
  switch (msg.event) {
    case 'loaded':
      figma.ui.postMessage({
          event: 'show'
      });
  }
};
