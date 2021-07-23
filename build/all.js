const buildScript = require('./script');
const buildStyle = require('./style');
const buildFigma = require('./figma');

// Build stuff
(async () => {
	// Build script
	await buildScript();

	// Build stylesheet
	await buildStyle();

	// Build plugin
	await buildFigma();
})();
