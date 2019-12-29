/**
 * This file is part of the @iconify/icon-finder package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt or license.gpl.txt
 * files that were distributed with this source code.
 *
 * Licensed under Apache 2.0 or GPL 2.0 at your option.
 * If derivative product is not compatible with one of licenses, you can pick one of licenses.
 *
 * @license Apache 2.0
 * @license GPL 2.0
 */
'use strict';

/**
 * Check if value is simple object
 *
 * @param data
 * @return {boolean}
 */
function isObject(data) {
	return (
		typeof data === 'object' &&
		Object.prototype.toString.call(data) === '[object Object]'
	);
}

class Storage {
	/**
	 * Create instance
	 *
	 * @param {object} defaults Default data
	 */
	constructor(defaults) {
		this.data = Object.create(null);
		if (isObject(defaults)) {
			this._setObject([], defaults, false);
		}
	}

	/**
	 * Set value
	 *
	 * @param {string} key
	 * @param {*} value
	 */
	set(key, value) {
		return this._set(key.split('.'), value);
	}

	/**
	 * Set values as object, merging with existing data
	 *
	 * Should not be used with values as class instances because it is not always possible to tell difference
	 * between simple object and class instance
	 *
	 * @param data
	 */
	merge(data) {
		this._setObject([], data, true);
	}

	/**
	 * Get value
	 *
	 * @param {string} key
	 * @return {*}
	 */
	get(key) {
		let keys = key.split('.'),
			lastKey = keys.pop(),
			ref = this.data,
			i;

		if (lastKey === void 0) {
			return;
		}

		for (i = 0; i < keys.length; i++) {
			if (!isObject(ref[keys[i]])) {
				return;
			}
			ref = ref[keys[i]];
		}
		return ref[lastKey];
	}

	/**
	 * Set value as object
	 *
	 * @param {Array} keys
	 * @param {object} data
	 * @param {boolean} [merge]
	 * @private
	 */
	_setObject(keys, data, merge) {
		let ref = this._findReference(keys);
		if (ref === null) {
			return;
		}
		this._setObjectByReference(ref, data, merge);
	}

	/**
	 * Set value as object
	 *
	 * @param {object} ref Parent element reference
	 * @param {object} data
	 * @param {boolean} [merge]
	 * @private
	 */
	_setObjectByReference(ref, data, merge) {
		Object.keys(data).forEach(key => {
			if (merge === true && isObject(data[key]) && isObject(ref[key])) {
				this._setObjectByReference(ref[key], data[key], merge);
				return;
			}
			ref[key] = data[key];
		});
	}

	/**
	 * Set value
	 *
	 * @param {Array} keys
	 * @param {*} value
	 * @return {boolean}
	 * @private
	 */
	_set(keys, value) {
		let lastKey, ref;

		keys = keys.slice(0);
		lastKey = keys.pop();
		if (lastKey === void 0) {
			return false;
		}

		ref = this._findReference(keys);
		if (ref === null) {
			return false;
		}

		ref[lastKey] = value;
		return true;
	}

	/**
	 * Find object for keys
	 *
	 * @param {Array} keys
	 * @return {object|null}
	 * @private
	 */
	_findReference(keys) {
		let ref = this.data,
			i,
			key;

		for (i = 0; i < keys.length; i++) {
			key = keys[i];
			if (ref[key] === void 0) {
				ref[key] = Object.create(null);
			} else if (!isObject(ref[key])) {
				return null;
			}
			ref = ref[key];
		}

		return ref;
	}
}

module.exports = Storage;
