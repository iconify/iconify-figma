'use strict';

const iconObject = require('../core/objects/icon');

const constants = require('./const');
const iconifyPages = constants.pages;

// Global options shared between all pages
const globalOptions = {
	// Layout
	compactLayout: false,
	showCodePage: false,

	// Icon customizations
	color: '',
	height: '',
	rotate: 0,
	hFlip: false,
	vFlip: false,

	// Selected icon
	icon: null,

	// Import and drag/drop options
	customizeDrop: false,
	dropToFrame: true,
	selectNodes: 'add',

	// Node for importing icons
	node: '',
	nodeX: constants.alignX[1],
	nodeY: constants.alignY[1],

	// Limit for recent icons / bookmarks
	storageLimit: 200,
};

// Page specific options
const pageOptions = {
	list: false,
	forceList: false,
};

// List of pages where list view is forced
const forceList = ['recent', 'bookmarks'];

// List of attributes for icon transformations
const iconTransformations = ['rotate', 'vFlip', 'hFlip'];
const iconExtraProperties = ['color', 'height'];

class Options {
	constructor(state) {
		this.options = {}; // [option] = value
		this.pageOptions = {}; // [option][page] = value

		// Create getters
		Object.keys(globalOptions).forEach(name => {
			if (name === 'icon') {
				return;
			}
			Object.defineProperty(this, name, {
				get: this.getGlobalOption.bind(this, name),
				set: this.setGlobalOption.bind(this, name),
			});
		});

		// Set default values
		this.setDefaults();

		// Restore state
		if (typeof state === 'object') {
			this.state = state;
			this.setForcedValues();
		}
	}

	/**
	 * Reset to default values
	 */
	setDefaults() {
		this.currentPage = 'iconify';

		Object.keys(globalOptions).forEach(name => {
			this.options[name] = globalOptions[name];
		});

		Object.keys(pageOptions).forEach(name => {
			this.pageOptions[name] = {};

			// Set defaults
			iconifyPages.forEach(page => {
				this.pageOptions[name][page] = pageOptions[name];
			});
		});

		// Overwrite defaults
		this.setForcedValues();
	}

	/**
	 * Overwrite defaults
	 */
	setForcedValues() {
		forceList.forEach(page => {
			this.pageOptions.list[page] = true;
			this.pageOptions.forceList[page] = true;
		});
	}

	/**
	 * Get default value
	 *
	 * @param {string} name
	 * @return {*}
	 */
	getDefaultValue(name) {
		return pageOptions[name] === void 0
			? globalOptions[name]
			: pageOptions[name];
	}

	/**
	 * Get global option value
	 *
	 * @param {string} name
	 * @return {*}
	 */
	getGlobalOption(name) {
		return this.options[name];
	}

	/**
	 * Set global option
	 *
	 * @param {string} name
	 * @param {*} value
	 */
	setGlobalOption(name, value) {
		if (value === void 0) {
			// Reset to default
			value = globalOptions[name];
		}
		this.options[name] = value;
	}

	/**
	 * Get page specific option value
	 *
	 * @param {string} name
	 * @param {string} [page]
	 * @return {*}
	 */
	getPageOption(name, page) {
		return this.pageOptions[name][page ? page : this.currentPage];
	}

	/**
	 * Set page specific option
	 *
	 * @param {string} name
	 * @param {*} value
	 * @param {string} [page]
	 */
	setPageOption(name, value, page) {
		if (value === void 0) {
			// Reset to default
			value = pageOptions[name];
		}
		this.pageOptions[name][page ? page : this.currentPage] = value;
	}

	/**
	 * Get page
	 *
	 * @return {string}
	 */
	get page() {
		return this.currentPage;
	}

	/**
	 * Set page
	 *
	 * @param {string} value
	 */
	set page(value) {
		if (iconifyPages.indexOf(value) === -1) {
			// Throw error to make sure new pages are added to options object
			throw 'Unknown page: ' + value;
		}
		this.currentPage = value;
	}

	/**
	 * Get list option
	 *
	 * @return {boolean}
	 */
	get list() {
		return this.getPageOption('forceList') ? true : this.getPageOption('list');
	}

	/**
	 * Set list option
	 *
	 * @param {boolean} value
	 */
	set list(value) {
		this.setPageOption('list', value);
	}

	/**
	 * Get forceList value
	 *
	 * @return {boolean}
	 */
	get forceList() {
		return this.getPageOption('forceList');
	}

	/**
	 * Set forceList value
	 *
	 * @param {boolean} value
	 */
	set forceList(value) {
		throw 'forceList is read only';
	}

	/**
	 * Get current state
	 */
	get state() {
		let state = {};

		// Copy customized global options
		Object.keys(globalOptions).forEach(name => {
			if (name === 'icon') {
				if (this.options.icon !== null) {
					state[name] = this.iconName;
				}
				return;
			}

			if (this.options[name] !== globalOptions[name]) {
				state[name] = this.options[name];
			}
		});

		// Copy customized page specific options, but only from 'iconify' page
		Object.keys(pageOptions).forEach(name => {
			if (this.pageOptions[name].iconify !== pageOptions[name]) {
				state[name] = this.pageOptions[name].iconify;
			}
		});

		return state;
	}

	/**
	 * Set state
	 *
	 * @param {object} value
	 */
	set state(value) {
		if (typeof value !== 'object') {
			return;
		}

		// Copy customized global options
		Object.keys(globalOptions).forEach(name => {
			if (name === 'icon') {
				this[name] = value[name];
				return;
			}

			if (value[name] !== void 0) {
				this.options[name] = value[name];
			}
		});

		// Copy customized page specific options, but only from 'iconify' page
		Object.keys(pageOptions).forEach(name => {
			if (value[name] !== void 0) {
				this.pageOptions[name].iconify = value[name];
			}
		});
	}

	/**
	 * Get icon
	 *
	 * @return {object}
	 */
	get icon() {
		return this.options.icon;
	}

	/**
	 * Set icon
	 *
	 * @param {object|string} value
	 */
	set icon(value) {
		let icon;

		if (
			!value ||
			!(icon = iconObject(value)) ||
			!icon.prefix.length ||
			!icon.name.length
		) {
			// Empty or invalid value
			this.options.icon = null;
			return;
		}

		this.options.icon = icon;
	}

	/**
	 * Get icon name
	 *
	 * @return {string|null}
	 */
	get iconName() {
		return this.options.icon
			? this.options.icon.prefix + ':' + this.options.icon.name
			: null;
	}

	/**
	 * Set icon by name
	 *
	 * @param {string} value
	 */
	set iconName(value) {
		this.icon = value;
	}

	/**
	 * Get icon transformations
	 *
	 * @return {object}
	 */
	getIconTransformations(includeExtra) {
		let result = {};

		iconTransformations.forEach(attr => {
			result[attr] = this.options[attr];
		});

		if (includeExtra) {
			// Include color and height
			iconExtraProperties.forEach(attr => {
				result[attr] = this.options[attr];
			});
		}

		return result;
	}

	/**
	 * Trigger onChange event, if listener is set
	 */
	triggerChange() {
		if (typeof this.onChange === 'function') {
			this.onChange();
		}
	}
}

module.exports = Options;
