const fs = require('fs');
const path = require('path');

const manifest = JSON.parse(
	fs.readFileSync(path.dirname(__dirname) + '/manifest.json', 'utf8')
);

/**
 * Build configuration
 */
module.exports = {
	// Entry points for build scripts, relative to root directory.
	// Comment out or delete entry that you do not want to be compiled.
	build: {
		// Main script
		script: 'src/icon-finder/index.ts',
		// Stylesheet
		style: 'src/style-figma/style.scss',
	},

	// Output names for temporary files
	output: {
		// Directory, relative to root directory, cannot be empty
		dir: 'dist',
		// Filename of script (build script will create ".js" and ".min.js" files)
		script: 'icon-finder.js',
		// Filename of stylesheet
		style: 'style.css',
	},

	// Figma plugin
	figma: {
		script: 'src/figma/index.ts',
		template: 'src/template/page.html',
		main: manifest.main,
		ui: manifest.ui,
	},
};
