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

const viewTypes = {
	search: require('./search'),
	collection: require('./collection'),
	collections: require('./collections'),
	custom: require('./custom'),
};

class Views {
	constructor(instance) {
		this._app = instance;
		this._view = null;
		this._visibleView = null;

		this._delay = instance.get('config').get('viewLoadingDelay');
		this._events = instance.get('events');
		if (this._events) {
			this._events.subscribe('view-loaded', this._viewLoaded.bind(this));
			this._events.subscribe('view-updated', this._viewUpdated.bind(this));
		}

		this._loadingTimer = null;
		this._loadingTimerView = null;
		this._pendingViewChange = false;
		this._pendingViewUpdate = null;
	}

	/**
	 * Get route
	 *
	 * @return {object}
	 */
	getRoute() {
		return this._view ? this._view.getRoute() : null;
	}

	/**
	 * Set view to route.
	 *
	 * This function changes current view
	 *
	 * @param {object|string} route
	 * @return {object} Current view
	 */
	setRoute(route) {
		if (typeof route === 'string') {
			if (!route.length) {
				// Home
				return this.home();
			}
			try {
				route = JSON.parse(route);
			} catch (err) {
				route = null;
			}
		}

		if (!route) {
			// Home
			return this.home();
		}

		let view = this._fromRoute(route);

		// Set timer to check for error
		if (this._events) {
			this._homeOnFail(view);
		}

		// Set view, trigger change
		this._view = this._visibleView = view;
		this._triggerViewChange();
		return this._view;
	}

	/**
	 * Navigate to home
	 */
	home() {
		if (this._view) {
			while (this._view.parent) {
				this._view = this._view.parent;
			}
			this._visibleView = this._view;
			this._triggerViewChange();
			return this._view;
		}

		// Create home view
		if (this._app.params && typeof this._app.params.prefix === 'string') {
			// Set collection as home route
			this._view = this.createView(
				'collection',
				{
					prefix: this._app.params.prefix,
				},
				null
			);
		} else {
			// Set collections list as home route
			this._view = this.createView('collections', {}, null);
		}
		this._visibleView = this._view;
		this._triggerViewChange();
		return this._view;
	}

	/**
	 * Check if route is home page
	 *
	 * @param {object} view
	 * @return {boolean}
	 */
	isHome(view) {
		if (!view) {
			return false;
		}
		if (this._app.params && typeof this._app.params.prefix === 'string') {
			return (
				view.type === 'collection' && view.prefix === this._app.params.prefix
			);
		} else {
			return view.type === 'collections';
		}
	}

	/**
	 * Set current view
	 *
	 * @param view
	 */
	setView(view) {
		if (!view.loading || !this._delay || !this._view || this._view.loading) {
			// Set both _view and _visibleView
			this._view = this._visibleView = view;
			this._triggerViewChange();
			return;
		}

		// Pending view
		this._view = view;
		this._startLoadingTimer(view);
	}

	/**
	 * Get visible view
	 *
	 * @return {null|*}
	 */
	getVisibleView() {
		return this._visibleView;
	}

	/**
	 * Get active view
	 *
	 * @return {null|*}
	 */
	getView() {
		return this._view;
	}

	/**
	 * Start timer for changing visible view
	 *
	 * @param view
	 * @private
	 */
	_startLoadingTimer(view) {
		let timer;

		if (this._loadingTimer !== null) {
			clearTimeout(this._loadingTimer);
		}

		this._loadingTimerView = view;
		this._loadingTimer = timer = setTimeout(() => {
			if (this._loadingTimer !== timer) {
				return;
			}

			// Clear timer
			this._loadingTimer = null;
			this._loadingTimerView = null;

			// Change visible view
			if (this._view === view && this._visibleView !== this._view) {
				this._visibleView = view;
				this._triggerViewChange();
			}
		}, this._delay);
	}

	/**
	 * Trigger view change event
	 *
	 * @private
	 */
	_triggerViewChange() {
		if (this._pendingViewChange) {
			return;
		}
		this._pendingViewChange = true;
		setTimeout(() => {
			this._pendingViewChange = false;
			if (this._events) {
				this._events.fire('current-view', this._visibleView);
			}
		});
	}

	/**
	 * Trigger view update event
	 *
	 * @private
	 */
	_triggerViewUpdate() {
		if (this._pendingViewUpdate === this._visibleView) {
			return;
		}

		this._pendingViewUpdate = this._visibleView;
		setTimeout(() => {
			if (this._pendingViewUpdate !== this._visibleView) {
				return;
			}
			this._pendingViewUpdate = null;
			if (this._events) {
				this._events.fire('current-view-updated', this._visibleView);
			}
		});
	}

	/**
	 * Event when view has loaded
	 *
	 * @param {object} view
	 * @private
	 */
	_viewLoaded(view) {
		if (view === this._loadingTimerView && this._loadingTimer) {
			// Clear timer if this view is being loaded
			clearTimeout(this._loadingTimer);
			this._loadingTimer = null;
			this._loadingTimerView = null;
		}

		if (view !== this._view) {
			return;
		}

		if (view !== this._visibleView) {
			// Change visibleView
			this._visibleView = view;
			this._triggerViewChange();
		} else {
			// Visible view has been updated
			this._triggerViewUpdate();
		}
	}

	/**
	 * View has been updated
	 *
	 * @param view
	 * @private
	 */
	_viewUpdated(view) {
		if (view === this._view || view === this._visibleView) {
			this._triggerViewUpdate();
		}
	}

	/**
	 * Create timer, navigate to home page if view fails to load
	 *
	 * @param {object} view
	 * @private
	 */
	_homeOnFail(view) {
		let timer = null,
			config,
			delay,
			counter;

		if (!view.loading) {
			return;
		}

		config = this._app.get('config');
		if (!config) {
			return;
		}

		delay = config.get('setRouteTimeout');
		if (!delay) {
			return;
		}

		// Generate event key
		if (!this._homeCounter) {
			this._homeCounter = 0;
		}
		this._homeCounter++;
		counter = this._homeCounter;

		// Subscribe to event
		this._events.subscribe(
			'view-loaded',
			loadedView => {
				if (loadedView !== view) {
					return;
				}
				// Success!
				this._events.unsubscribe('view-loaded', 'home-on-fail-' + counter);
				if (timer) {
					clearTimeout(timer);
					timer = null;
				}
			},
			'home-on-fail-' + counter
		);

		// Set timeout
		timer = setTimeout(() => {
			// Fail
			timer = null;
			this._events.unsubscribe('view-loaded', 'home-on-fail-' + counter);
			if (this._view === view && view.loading) {
				this.home();
			}
		}, delay);
	}

	/**
	 * Create view from route
	 *
	 * @param {string} route
	 * @return {object}
	 * @private
	 */
	_fromRoute(route) {
		let parent = route.parent ? this._fromRoute(route.parent) : null;
		return this.createView(
			route.type,
			{
				routeParams: route.params,
			},
			parent
		);
	}

	/**
	 * Create view.
	 *
	 * This function does not change current view, it is meant to be used by other views
	 *
	 * @param {string} type
	 * @param {object} [params]
	 * @param {object} [parent]
	 * @internal
	 */
	createView(type, params, parent) {
		if (viewTypes[type] === void 0) {
			return null;
		}
		return viewTypes[type](this._app, params, parent);
	}
}

module.exports = instance => new Views(instance);
