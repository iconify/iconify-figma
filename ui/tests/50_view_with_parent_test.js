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
	const collectionView = require('../src/core/views/collection');
	const collectionsView = require('../src/core/views/collections');
	const searchView = require('../src/core/views/search');
	const customView = require('../src/core/views/custom');

	const chai = require('chai'),
		expect = chai.expect,
		should = chai.should();

	describe('Testing view with parent view', () => {
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

		it('collections -> collection', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				collections,
				collection;

			// Set config
			instance.get('config').set('itemsPerPage', 48);

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
			events.subscribe('view-loaded', view => {
				if (view === collections) {
					// First load
					expect(collections.type).to.be.equal('collections');
					expect(collections.loading).to.be.equal(false);
					expect(collections.empty).to.be.equal(false);
					expect(collections.ready()).to.be.equal(true);

					// Test route
					expect(collections.route).to.be.eql({
						type: 'collections',
						params: {
							category: null,
							filter: '',
							search: '',
						},
						defaults: {
							category: null,
							filter: '',
							search: '',
						},
					});
					expect(collections.getRoute()).to.be.eql({
						type: 'collections',
					});

					collection = collectionView(
						instance,
						{
							prefix: 'fa-regular',
						},
						collections
					);
					expect(collection.ready()).to.be.equal(false);
				}

				if (collection && view === collection) {
					// Second load
					expect(collections.type).to.be.equal('collections');
					expect(collections).to.be.equal(collections);
					expect(collections.loading).to.be.equal(false);
					expect(collections.empty).to.be.equal(false);
					expect(collections.ready()).to.be.equal(true);

					expect(collection.type).to.be.equal('collection');
					expect(collection.route.params.prefix).to.be.equal('fa-regular');
					expect(collection.loading).to.be.equal(false);
					expect(collection.empty).to.be.equal(false);
					expect(collection.ready()).to.be.equal(true);

					// Test route
					expect(collection.route).to.be.eql({
						type: 'collection',
						params: {
							prefix: 'fa-regular',
							page: 0,
							search: '',
							tag: null,
							themePrefix: null,
							themeSuffix: null,
						},
						defaults: {
							page: 0,
							search: '',
							tag: null,
							themePrefix: null,
							themeSuffix: null,
						},
					});
					expect(collection.getRoute()).to.be.eql({
						type: 'collection',
						params: {
							prefix: 'fa-regular',
						},
						parent: {
							type: 'collections',
						},
					});

					// Test parent action
					let result = collection.action('parent', collection.parent);
					expect(result).to.be.equal(collections);

					done();
				}
			});

			// Create view
			collections = collectionsView(instance, {}, null);
			expect(collections.loading).to.be.equal(true);
		});

		it('collection -> custom', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				collection,
				custom;

			// Set config
			instance.get('config').set('itemsPerPage', 48);

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
			events.subscribe('load-history', callback => {
				callback([
					'ic:baseline-call',
					'ic:outline-call',
					'ic:round-call',
					'ic:sharp-call',
				]);
			});

			// Subscribe to event
			events.subscribe('view-loaded', view => {
				if (view === collection) {
					// First load
					expect(view.type).to.be.equal('collection');
					expect(view.loading).to.be.equal(false);
					expect(view.empty).to.be.equal(false);
					expect(view.ready()).to.be.equal(true);

					// Test route
					expect(view.getRoute()).to.be.eql({
						type: 'collection',
						params: {
							prefix: 'fa-regular',
						},
					});

					// Load child view
					custom = view.action('child', {
						type: 'custom',
						params: {
							customType: 'history',
						},
					});
					expect(custom.type).to.be.equal('custom');
				}

				if (view === custom) {
					expect(view.type).to.be.equal('custom');
					expect(view.loading).to.be.equal(false);
					expect(view.empty).to.be.equal(false);
					expect(view.ready()).to.be.equal(true);

					// Test route
					expect(view.getRoute()).to.be.eql({
						type: 'custom',
						params: {
							customType: 'history',
						},
						parent: {
							type: 'collection',
							params: {
								prefix: 'fa-regular',
							},
						},
					});

					// Test parent action
					expect(view.action('parent', view.parent)).to.be.equal(collection);

					done();
				}
			});

			// Create view
			collection = collectionView(
				instance,
				{
					prefix: 'fa-regular',
				},
				null
			);
			expect(collection.loading).to.be.equal(true);
		});

		it('wrong loading order', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				counter = 0,
				collections,
				collection;

			// Set config
			instance.get('config').set('itemsPerPage', 48);

			// Set API data
			api.setFakeData(
				'collections',
				{},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')
				),
				100
			);
			api.setFakeData(
				'collection',
				apiParams('fa-regular'),
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/fa-regular.json', 'utf8')
				),
				0
			);

			// Subscribe to event
			events.subscribe('view-loaded', view => {
				counter++;

				// Child view should load first
				if (view === collection) {
					expect(counter).to.be.equal(1, 'Initial view took too long to load');

					expect(collections.loading).to.be.equal(true);
					expect(collections.ready()).to.be.equal(false);

					expect(collection.loading).to.be.equal(false);
					expect(collection.empty).to.be.equal(false);
					expect(collection.ready()).to.be.equal(false);

					// Test parent action
					let result = collection.action('parent', collection.parent);
					expect(result).to.be.equal(collections);
				}

				// Parent view should load second
				if (view === collections) {
					expect(counter).to.be.equal(2);

					expect(collections.loading).to.be.equal(false);
					expect(collections.ready()).to.be.equal(true);

					expect(collection.loading).to.be.equal(false);
					expect(collection.ready()).to.be.equal(true);

					// Test parent action on collection
					let result = collection.action('parent', collection.parent);
					expect(collections).to.be.equal(collections);

					// Test parent action on collections
					result = collections.action('parent', collections.parent);
					expect(result).to.be.equal(null);

					done();
				}
			});

			// Create views
			collections = collectionsView(instance, {}, null);
			collection = collectionView(
				instance,
				{
					prefix: 'fa-regular',
				},
				collections
			);
		});
	});
})();
