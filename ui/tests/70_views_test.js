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

(() => {
	const fs = require('fs');
	const Search = require('../src/core/search');
	const fakeAPI = require('./fake_api');

	const chai = require('chai'),
		expect = chai.expect,
		should = chai.should();

	describe('Testing views manager', () => {
		let nsCounter = 0;

		function customSearch(params) {
			if (params.namespace === void 0) {
				params.namespace = __filename + nsCounter++;
			}
			let search = Search.init(params);
			search._data.api = fakeAPI(search);
			return search;
		}

		function apiParams(prefix) {
			return {
				prefix: prefix,
				info: true,
				chars: true,
				aliases: true,
			};
		}

		it('navigate to home', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				views,
				home;

			// Set config
			let config = instance.get('config');
			config.set('itemsPerPage', 48);
			config.set('search.limit', 64);
			config.set('search.fullLimit', 999);
			config.set('viewLoadingDelay', 200);

			views = instance.get('views');

			// Set API data
			api.setFakeData(
				'collections',
				{},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')
				),
				0
			);

			// Subscribe to events
			events.subscribe('view-loaded', view => {
				expect(view).to.be.equal(home);

				done();
			});

			expect(views.getView()).to.be.equal(null);
			expect(views.getVisibleView()).to.be.equal(null);
			expect(views.getRoute()).to.be.equal(null);

			// Navigate to home page
			home = views.home();
			expect(typeof home).to.be.equal('object');
			expect(home.type).to.be.equal('collections');
			expect(home.parent).to.be.equal(null);
			expect(views.getRoute()).to.be.eql({
				type: 'collections',
			});
		});

		it('navigate to home with prefix', done => {
			let instance = customSearch({
					prefix: 'ant-design',
				}),
				api = instance.get('api'),
				events = instance.get('events'),
				views,
				home;

			// Set config
			let config = instance.get('config');
			config.set('itemsPerPage', 48);
			config.set('search.limit', 64);
			config.set('search.fullLimit', 999);
			config.set('viewLoadingDelay', 200);

			views = instance.get('views');

			// Set API data
			api.setFakeData(
				'collection',
				apiParams('ant-design'),
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/ant-design.json', 'utf8')
				),
				20
			);

			// Subscribe to events
			events.subscribe('view-loaded', view => {
				expect(view).to.be.equal(home);

				done();
			});

			expect(views.getVisibleView()).to.be.equal(null);
			expect(views.getRoute()).to.be.equal(null);

			// Navigate to home page
			home = views.home();
			expect(typeof home).to.be.equal('object');
			expect(home.parent).to.be.equal(null);
			expect(home.getRoute()).to.be.eql({
				type: 'collection',
				params: {
					prefix: 'ant-design',
				},
			});
			expect(views.getRoute()).to.be.eql({
				type: 'collection',
				params: {
					prefix: 'ant-design',
				},
			});
		});

		it('create custom view, navigate to home', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				counter = 0,
				views,
				view1,
				view2;

			// Set config
			let config = instance.get('config');
			config.set('itemsPerPage', 48);
			config.set('search.limit', 64);
			config.set('search.fullLimit', 999);
			config.set('viewLoadingDelay', 200);

			views = instance.get('views');

			// Set API data
			api.setFakeData(
				'collections',
				{},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')
				),
				0
			);
			api.setFakeData(
				'collection',
				apiParams('ant-design'),
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/ant-design.json', 'utf8')
				),
				20
			);

			// Subscribe to events
			events.subscribe('view-loaded', view => {
				counter++;

				if (counter === 1) {
					// First load
					expect(view).to.be.equal(view1);

					// Navigate to home
					view2 = views.home();
					expect(view2).to.not.be.equal(view1);
					expect(view2.getRoute()).to.be.eql({
						type: 'collections',
					});
				}

				if (counter === 2) {
					// Second load
					expect(view).to.be.equal(view2);
					done();
				}
			});

			expect(views.getView()).to.be.equal(null);
			expect(views.getVisibleView()).to.be.equal(null);

			// Create view. This should not change current view in views manager
			view1 = views.createView('collection', {
				prefix: 'ant-design',
			});
			expect(typeof view1).to.be.equal('object');
			expect(view1.getRoute()).to.be.eql({
				type: 'collection',
				params: {
					prefix: 'ant-design',
				},
			});
		});

		it('create custom view from route, navigate to home', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				views,
				view1;

			// Set config
			let config = instance.get('config');
			config.set('itemsPerPage', 48);
			config.set('search.limit', 64);
			config.set('search.fullLimit', 999);
			config.set('viewLoadingDelay', 200);

			views = instance.get('views');

			// Set API data
			api.setFakeData(
				'collections',
				{},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')
				),
				0
			);
			api.setFakeData(
				'collection',
				apiParams('ant-design'),
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/ant-design.json', 'utf8')
				),
				20
			);

			// Subscribe to events
			events.subscribe('view-loaded', view => {
				expect(view).to.be.equal(view1);

				// Navigate to home
				expect(views.home()).to.be.equal(view1);
				done();
			});

			expect(views.getView()).to.be.equal(null);
			expect(views.getVisibleView()).to.be.equal(null);

			// Create view. This should change current view in views manager
			view1 = views.setRoute({
				type: 'collection',
				params: {
					prefix: 'ant-design',
				},
			});
			expect(typeof view1).to.be.equal('object');
			expect(view1.getRoute()).to.be.eql({
				type: 'collection',
				params: {
					prefix: 'ant-design',
				},
			});
		});

		it('create view from route with parent, navigate to home', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				completed = false,
				views,
				collection,
				collections;

			// Set config
			let config = instance.get('config');
			config.set('itemsPerPage', 48);
			config.set('search.limit', 64);
			config.set('search.fullLimit', 999);
			config.set('viewLoadingDelay', 200);

			views = instance.get('views');

			// Set API data
			api.setFakeData(
				'collections',
				{},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')
				)
			);
			api.setFakeData(
				'collection',
				apiParams('fa-regular'),
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/fa-regular.json', 'utf8')
				)
			);

			// Subscribe to event
			events.subscribe('current-view', view => {
				// Async load after code completed
				expect(completed).to.be.equal(true);
				expect(view).to.be.equal(collections);
				done();
			});

			// Active and visible views should be set to null
			expect(views.getView()).to.be.equal(null);
			expect(views.getVisibleView()).to.be.equal(null);

			// Create view. This should change current view in views manager
			collection = views.setRoute({
				type: 'collection',
				params: {
					prefix: 'fa-regular',
					page: 2,
				},
				parent: {
					type: 'collections',
				},
			});

			// Check views
			expect(typeof collection).to.be.equal('object');
			expect(collection.type).to.be.equal('collection');
			expect(collection.getRoute()).to.be.eql({
				type: 'collection',
				params: {
					prefix: 'fa-regular',
					page: 2,
				},
				parent: {
					type: 'collections',
				},
			});

			expect(typeof collection.parent).to.be.equal('object');
			collections = collection.parent;
			expect(collections.getRoute()).to.be.eql({
				type: 'collections',
			});

			// Active and visible views should be set to collection
			expect(views.getView()).to.be.equal(collection);
			expect(views.getVisibleView()).to.be.equal(collection);

			expect(views.getRoute()).to.be.eql({
				type: 'collection',
				params: {
					prefix: 'fa-regular',
					page: 2,
				},
				parent: {
					type: 'collections',
				},
			});

			// Navigate to home
			expect(views.home()).to.be.equal(collections);
			expect(views.getView()).to.be.equal(collections); // main view changed
			expect(views.getVisibleView()).to.be.equal(collections); // visible view was changed because home() shows view immediately
			expect(views.getRoute()).to.be.eql({
				type: 'collections',
			});

			// Mark synchronous code as completed
			completed = true;
		});

		it('home, then collection', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				counter = 0,
				views,
				collection,
				collections;

			// Set config
			let config = instance.get('config');
			config.set('itemsPerPage', 48);
			config.set('search.limit', 64);
			config.set('search.fullLimit', 999);
			config.set('viewLoadingDelay', 200);

			views = instance.get('views');

			// Set API data
			api.setFakeData(
				'collections',
				{},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')
				)
			);
			api.setFakeData(
				'collection',
				apiParams('fa-regular'),
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/fa-regular.json', 'utf8')
				)
			);

			// Subscribe to event
			events.subscribe('current-view', view => {
				counter++;

				if (counter === 1) {
					// First load - collections list
					expect(view).to.be.equal(collections);

					// Navigate to fa-regular by using action
					collection = view.action('collections', 'fa-regular');
					expect(collection).to.not.be.equal(view);
					expect(collection.getRoute()).to.be.eql({
						type: 'collection',
						params: {
							prefix: 'fa-regular',
						},
						parent: {
							type: 'collections',
						},
					});
				}

				if (counter === 2) {
					// Second load - fa-regular
					expect(view).to.be.equal(collection);
					done();
				}
			});

			// Active and visible views should be set to null
			expect(views.getView()).to.be.equal(null);
			expect(views.getVisibleView()).to.be.equal(null);

			// Create view. This should change current view in views manager
			collections = views.home();

			// Check views
			expect(typeof collections).to.be.equal('object');
			expect(collections.type).to.be.equal('collections');
			expect(collections.getRoute()).to.be.eql({
				type: 'collections',
			});

			// Active and visible views should be set to collections
			expect(views.getView()).to.be.equal(collections);
			expect(views.getVisibleView()).to.be.equal(collections);
		});

		it('home, then 2 collections', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				counter = 0,
				views,
				collection1,
				collection2,
				collections;

			// Set config
			let config = instance.get('config');
			config.set('itemsPerPage', 48);
			config.set('search.limit', 64);
			config.set('search.fullLimit', 999);
			config.set('viewLoadingDelay', 100);

			views = instance.get('views');

			// Set API data
			api.setFakeData(
				'collections',
				{},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')
				)
			);
			api.setFakeData(
				'collection',
				apiParams('fa-regular'),
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/fa-regular.json', 'utf8')
				)
			);

			// Delay by 300ms
			api.setFakeData(
				'collection',
				apiParams('ant-design'),
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/ant-design.json', 'utf8')
				),
				300
			);

			// Subscribe to event
			events.subscribe('current-view', view => {
				counter++;

				if (counter === 1) {
					// First load - home
					expect(view).to.be.equal(collections);
					expect(views.getVisibleView()).to.be.equal(collections);
					expect(views.getView()).to.be.equal(collections);
					expect(views.getRoute()).to.be.eql({
						type: 'collections',
					});

					// Navigate to fa-regular
					collection1 = collections.action('collections', 'fa-regular');

					// Active view should be set to fa-regular
					expect(views.getView()).to.be.equal(collection1);

					// Visible view should be set to collections list because fa-regular is still loading
					expect(views.getVisibleView()).to.be.equal(collections);
				}

				if (counter === 2) {
					// Second load - fa-regular
					expect(view).to.be.equal(collection1);
					expect(view.loading).to.be.equal(false);
					expect(views.getVisibleView()).to.be.equal(collection1);
					expect(views.getView()).to.be.equal(collection1);
					expect(views.getRoute()).to.be.eql({
						type: 'collection',
						params: {
							prefix: 'fa-regular',
						},
						parent: {
							type: 'collections',
						},
					});

					// Navigate to ant-design by using action
					collection2 = collections.action('collections', 'ant-design');
					expect(collection2).to.not.be.equal(collections);
					expect(views.getRoute()).to.be.eql({
						type: 'collection',
						params: {
							prefix: 'ant-design',
						},
						parent: {
							type: 'collections',
						},
					});

					// Showing fa-regular while ant-design is loading
					expect(views.getVisibleView()).to.be.equal(collection1);
					expect(views.getView()).to.be.equal(collection2);
				}

				if (counter === 3) {
					// Third load - ant-design, but not ready because API timer is higher than viewLoadingDelay
					expect(view).to.be.equal(collection2);

					// This could fail when test is ran on slow computer
					expect(view.loading).to.be.equal(true);

					expect(views.getRoute()).to.be.eql({
						type: 'collection',
						params: {
							prefix: 'ant-design',
						},
						parent: {
							type: 'collections',
						},
					});

					// Show ant-design, even though it hasn't loaded yet
					expect(views.getVisibleView()).to.be.equal(collection2);
					expect(views.getView()).to.be.equal(collection2);

					done();
				}
			});

			// Active and visible views should be set to null
			expect(views.getView()).to.be.equal(null);
			expect(views.getVisibleView()).to.be.equal(null);

			// Create view. This should change current view in views manager
			collections = views.home();

			// Check views
			expect(typeof collections).to.be.equal('object');
			expect(collections.type).to.be.equal('collections');
			expect(collections.getRoute()).to.be.eql({
				type: 'collections',
			});

			// Active and visible views should be set to collections
			expect(views.getView()).to.be.equal(collections);
			expect(views.getVisibleView()).to.be.equal(collections);
		});

		it('home and immediately load collection', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				views,
				collection1,
				collections;

			// Set config
			let config = instance.get('config');
			config.set('itemsPerPage', 48);
			config.set('search.limit', 64);
			config.set('search.fullLimit', 999);
			config.set('viewLoadingDelay', 100);

			views = instance.get('views');

			// Set API data
			api.setFakeData(
				'collections',
				{},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')
				),
				10
			);
			api.setFakeData(
				'collection',
				apiParams('fa-regular'),
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/fa-regular.json', 'utf8')
				),
				10
			);

			// Subscribe to event
			events.subscribe('current-view', view => {
				expect(view).to.be.equal(collection1);
				expect(views.getVisibleView()).to.be.equal(collection1);
				expect(views.getView()).to.be.equal(collection1);
				expect(views.getRoute()).to.be.eql({
					type: 'collection',
					params: {
						prefix: 'fa-regular',
					},
					parent: {
						type: 'collections',
					},
				});
				done();
			});

			// Active and visible views should be set to null
			expect(views.getView()).to.be.equal(null);
			expect(views.getVisibleView()).to.be.equal(null);

			// Create view. This should change current view in views manager
			collections = views.home();

			// Check views
			expect(typeof collections).to.be.equal('object');
			expect(collections.type).to.be.equal('collections');
			expect(collections.getRoute()).to.be.eql({
				type: 'collections',
			});

			// Active and visible views should be set to collections
			expect(views.getView()).to.be.equal(collections);
			expect(views.getVisibleView()).to.be.equal(collections);

			// Navigate to fa-regular
			collection1 = collections.action('collections', 'fa-regular');

			// Active view should be set to fa-regular
			expect(views.getView()).to.be.equal(collection1);

			// Visible view should be set to fa-regular because collections list is loading too
			expect(views.getVisibleView()).to.be.equal(collection1);

			expect(views.getRoute()).to.be.eql({
				type: 'collection',
				params: {
					prefix: 'fa-regular',
				},
				parent: {
					type: 'collections',
				},
			});
		});

		it('home and immediately load 2 collections', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				views,
				collection1,
				collection2,
				collections;

			// Set config
			let config = instance.get('config');
			config.set('itemsPerPage', 48);
			config.set('search.limit', 64);
			config.set('search.fullLimit', 999);
			config.set('viewLoadingDelay', 100);

			views = instance.get('views');

			// Set API data
			api.setFakeData(
				'collections',
				{},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')
				),
				10
			);
			api.setFakeData(
				'collection',
				apiParams('fa-regular'),
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/fa-regular.json', 'utf8')
				),
				10
			);
			api.setFakeData(
				'collection',
				apiParams('ant-design'),
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/ant-design.json', 'utf8')
				),
				10
			);

			// Subscribe to event
			events.subscribe('current-view', view => {
				expect(view).to.be.equal(collection2);
				expect(views.getVisibleView()).to.be.equal(collection2);
				expect(views.getView()).to.be.equal(collection2);
				expect(views.getRoute()).to.be.eql({
					type: 'collection',
					params: {
						prefix: 'ant-design',
					},
					parent: {
						type: 'collections',
					},
				});
				done();
			});

			// Active and visible views should be set to null
			expect(views.getView()).to.be.equal(null);
			expect(views.getVisibleView()).to.be.equal(null);

			// Create view. This should change current view in views manager
			collections = views.home();

			// Check views
			expect(typeof collections).to.be.equal('object');
			expect(collections.type).to.be.equal('collections');
			expect(collections.getRoute()).to.be.eql({
				type: 'collections',
			});

			// Active and visible views should be set to collections
			expect(views.getView()).to.be.equal(collections);
			expect(views.getVisibleView()).to.be.equal(collections);

			// Navigate to fa-regular
			collection1 = collections.action('collections', 'fa-regular');

			// Active view should be set to fa-regular
			expect(views.getView()).to.be.equal(collection1);

			// Visible view should be set to fa-regular because collections list is loading too
			expect(views.getVisibleView()).to.be.equal(collection1);

			expect(views.getRoute()).to.be.eql({
				type: 'collection',
				params: {
					prefix: 'fa-regular',
				},
				parent: {
					type: 'collections',
				},
			});

			// Immediately navigate to ant-design, aborting fa-regular
			collection2 = collections.action('collections', 'ant-design');

			// Active view should be set to ant-design
			expect(views.getView()).to.be.equal(collection2);

			// Visible view should be set to ant-design because collections list is loading too
			expect(views.getVisibleView()).to.be.equal(collection2);

			expect(views.getRoute()).to.be.eql({
				type: 'collection',
				params: {
					prefix: 'ant-design',
				},
				parent: {
					type: 'collections',
				},
			});
		});

		it('updating current view', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				counter = 0,
				views,
				collection1,
				collection2,
				collections;

			// Set config
			let config = instance.get('config');
			config.set('itemsPerPage', 48);
			config.set('search.limit', 64);
			config.set('search.fullLimit', 999);
			config.set('viewLoadingDelay', 100);

			views = instance.get('views');

			// Set API data
			api.setFakeData(
				'collections',
				{},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')
				)
			);
			api.setFakeData(
				'collection',
				apiParams('fa-regular'),
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/fa-regular.json', 'utf8')
				),
				50
			);

			// Delay by 300ms
			api.setFakeData(
				'collection',
				apiParams('ant-design'),
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/ant-design.json', 'utf8')
				),
				300
			);

			// Subscribe to current-view event to see when view changes
			events.subscribe('current-view-updated', view => {
				counter++;

				// First action after loading collections list
				if (counter === 2) {
					expect(view).to.be.equal(collections);
					expect(view.getRoute()).to.be.eql({
						type: 'collections',
						params: {
							filter: 'fa',
						},
					});
					expect(views.getView()).to.be.equal(collections);
					expect(views.getVisibleView()).to.be.equal(collections);

					// Change filter and category. This should trigger one update, not 2
					view.action('filter', 'mdi');
					view.action('categories', 'General');
					return;
				}

				if (counter === 3) {
					expect(view).to.be.equal(collections);
					expect(view.getRoute()).to.be.eql({
						type: 'collections',
						params: {
							filter: 'mdi',
							category: 'General',
						},
					});
					expect(views.getView()).to.be.equal(collections);
					expect(views.getVisibleView()).to.be.equal(collections);

					// Navigate to collection
					collection1 = view.action('collections', 'ant-design');
					expect(collection1.getRoute()).to.be.eql({
						type: 'collection',
						params: {
							prefix: 'ant-design',
						},
						parent: {
							type: 'collections',
							params: {
								filter: 'mdi',
								category: 'General',
							},
						},
					});

					expect(views.getView()).to.be.equal(collection1);
					expect(views.getVisibleView()).to.be.equal(collections);

					return;
				}

				if (counter === 5) {
					// ant-design has loaded. change to fa-regular
					expect(views.getView()).to.be.equal(collection1);
					expect(views.getVisibleView()).to.be.equal(collection1);

					collection2 = collections.action('collections', 'fa-regular');

					expect(views.getView()).to.be.equal(collection2);
					expect(views.getVisibleView()).to.be.equal(collection1);
					return;
				}

				done('Unexpected counter value: ' + counter);
			});

			// Subscribe to current-view event to see when view changes
			events.subscribe('current-view', view => {
				counter++;

				if (view === collections) {
					// First load. Should be fired before other events
					expect(counter).to.be.equal(1);

					expect(views.getView()).to.be.equal(collections);
					expect(views.getVisibleView()).to.be.equal(collections);

					// Change filter
					view.action('filter', 'fa');
				}

				if (view === collection1) {
					// ant-design is still loading, but was set as current view
					expect(counter).to.be.equal(4);
					expect(view.loading).to.be.equal(true);

					expect(views.getView()).to.be.equal(collection1);
					expect(views.getVisibleView()).to.be.equal(collection1);
				}

				if (view === collection2) {
					// fa-regular has loaded
					expect(counter).to.be.equal(6);
					expect(view.loading).to.be.equal(false);

					expect(views.getView()).to.be.equal(collection2);
					expect(views.getVisibleView()).to.be.equal(collection2);

					setTimeout(() => {
						// fa-regular should not trigger current-view-updated event, so counter should not change
						expect(counter).to.be.equal(6);
						expect(views.getView()).to.be.equal(collection2);
						expect(views.getVisibleView()).to.be.equal(collection2);
						done();
					}, 100);
				}
			});

			// Create view. This should change current view in views manager
			collections = views.home();

			expect(views.getView()).to.be.equal(collections);
			expect(views.getVisibleView()).to.be.equal(collections);
		});
	});
})();
