const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const config = require('./config');
const { mkdir } = require('./fs');

const figmaConfig = config.figma;

// Directories
const rootDir = path.dirname(__dirname);
const distDir = rootDir + '/' + config.output.dir;

/**
 * Write file
 */
function writeFile(name, content) {
	fs.writeFileSync(rootDir + '/' + name, content, 'utf8');
	console.log(`Created ${name} (${content.length} bytes)`);
}

/**
 * Simple replace
 *
 * String.replace() does not work correctly because it converts first argument
 * to RegEx, often failing when replacment is minified JavaScript file
 */
function replace(html, search, replace) {
	const parts = html.split(search);
	if (parts.length !== 2) {
		throw new Error(`Error replacing "${search}"`);
	}
	return parts.join(replace);
}

/**
 * Build function
 */
async function build() {
	// Get files
	const template = fs.readFileSync(
		rootDir + '/' + figmaConfig.template,
		'utf8'
	);
	const iconFinder = fs.readFileSync(
		distDir + '/' + config.output.script.replace(/\.js$/, '.min.js'),
		'utf8'
	);
	const stylesheet = fs.readFileSync(
		distDir + '/' + config.output.style,
		'utf8'
	);

	// Create HTML
	let html = template;

	if (stylesheet.indexOf('<') !== -1) {
		throw new Error('Found HTML tag in stylesheet');
	}
	html = replace(
		html,
		'{{stylesheet}}',
		'<style>\n' + stylesheet + '\n</style>',
		'</'
	);

	if (iconFinder.indexOf('</script') !== -1) {
		throw new Error('Found script tag in Icon Finder');
	}
	html = replace(
		html,
		'{{container}}',
		'<script>\n' + iconFinder + '\n</script>',
		'</'
	);

	// Write files
	writeFile(figmaConfig.ui, html);
}

/**
 * Export or build
 */
if (!module.parent) {
	build().catch((err) => {
		console.error(err);
	});
} else {
	module.exports = build;
}
