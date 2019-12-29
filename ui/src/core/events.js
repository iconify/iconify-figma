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

class Events {
	constructor(instance) {
		this._app = instance;
		this._data = Object.create(null);
		this._counter = 0;
	}

	/**
	 * Subscribe to event
	 *
	 * @param {string} event
	 * @param {function} callback
	 * @param {string} [key] Unique key, used for unsubscribe if function is dynamic
	 */
	subscribe(event, callback, key) {
		if (this._data[event] === void 0) {
			this._data[event] = Object.create(null);
		}
		if (typeof key !== 'string') {
			key = 'handler' + this._counter++;
		}
		this._data[event][key] = callback;
	}

	/**
	 * Unsubscribe from event
	 *
	 * @param {string} event
	 * @param {string|function} item Key or callback used when subscribing to event
	 */
	unsubscribe(event, item) {
		if (this._data[event] === void 0) {
			return;
		}
		if (typeof item !== 'string') {
			Object.keys(this._data[event]).forEach(key => {
				if (this._data[event][key] === item) {
					item = key;
				}
			});
		}
		if (typeof item === 'string') {
			delete this._data[event][item];
		}
	}

	/**
	 * Check if there are any event listeners
	 *
	 * @param {string} event
	 * @return {boolean}
	 */
	hasListeners(event) {
		return (
			this._data[event] !== void 0 && Object.keys(this._data[event]).length > 0
		);
	}

	/**
	 * Fire event
	 *
	 * @param {string} event
	 * @param {*} [data]
	 * @param {boolean} [delay]
	 */
	fire(event, data, delay) {
		if (this._data[event] === void 0) {
			return;
		}
		Object.keys(this._data[event]).forEach(key => {
			if (delay) {
				setTimeout(() => {
					if (this._data[event][key] !== void 0) {
						this._data[event][key](data);
					}
				});
			} else {
				if (this._data[event][key] !== void 0) {
					this._data[event][key](data);
				}
			}
		});
	}
}

module.exports = instance => new Events(instance);
