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

	const chai = require('chai'),
		expect = chai.expect,
		should = chai.should();

	describe('Testing actions that change views', () => {
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

		it('searching from collections list', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				counter = 0,
				collections,
				search,
				search2;

			// Set config
			instance.get('config').set('itemsPerPage', 48);
			instance.get('config').set('search.limit', 64);
			instance.get('config').set('search.fullLimit', 999);

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
				'search',
				{
					query: 'home',
					limit: 64,
				},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/search-home.json', 'utf8')
				),
				20
			);
			api.setFakeData(
				'search',
				{
					query: 'home',
					limit: 999,
				},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/search-home-full.json', 'utf8')
				),
				20
			);

			// Subscribe to event
			events.subscribe('view-loaded', view => {
				counter++;

				if (counter === 1) {
					// Collections have loaded
					expect(view).to.be.equal(collections);

					// Change search value without rendering new view
					search = view.action('search', 'arrow', true);
					expect(search).to.be.equal(view);

					// Search icons
					search = view.action('search', 'home');

					expect(search).to.not.be.equal(view);
					expect(search.type).to.be.equal('search');
					expect(search.parent).to.be.equal(collections);
					expect(search.loading).to.be.equal(true);
				}

				if (counter === 2) {
					// Search have loaded
					expect(view).to.be.equal(search);
					expect(view.loading).to.be.equal(false);

					// Test parent action
					let result = view.action('parent', view.parent);
					expect(result).to.not.be.equal(null);
					expect(result).to.be.equal(collections);

					// Test full search
					search2 = search.action('pagination', 'more');

					expect(search2).to.not.be.equal(null);
					expect(search2.type).to.be.equal('search');
					expect(search2).to.not.be.equal(search);
					expect(search2.parent).to.be.equal(collections);
					expect(search2.loading).to.be.equal(true);
				}

				if (counter === 3) {
					// Full search have loaded
					expect(view).to.be.equal(search2);
					expect(view.loading).to.be.equal(false);

					done();
				}
			});

			// Create view
			collections = collectionsView(instance, {}, null);
		});

		it('collection from search results', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				counter = 0,
				search,
				collection,
				collection2;

			let expectedCollections = {
				'ant-design': 'Ant Design Icons',
				'bytesize': 'Bytesize Icons',
				'dashicons': 'Dashicons',
				'el': 'Elusive Icons',
				'entypo': 'Entypo+',
				'fa-solid': 'Font Awesome 5 Solid',
				'fe': 'Feather Icon',
				'feather': 'Feather Icons',
				'flat-color-icons': 'Flat Color Icons',
				'foundation': 'Foundation',
				'ic': 'Google Material Icons',
				'icomoon-free': 'IcoMoon Free',
				'icons8': 'Icons8 Windows 10 Icons',
				'ion': 'IonIcons',
				'jam': 'Jam Icons',
				'maki': 'Maki',
				'map': 'Map Icons',
				'mdi': 'Material Design Icons',
				'mdi-light': 'Material Design Light',
				'octicon': 'Octicons',
				'oi': 'Open Iconic',
				'raphael': 'Raphael',
				'si-glyph': 'SmartIcons Glyph',
				'subway': 'Subway Icon Set',
			};

			// Set config
			instance.get('config').set('itemsPerPage', 48);
			instance.get('config').set('search.limit', 64);
			instance.get('config').set('search.fullLimit', 999);

			// Set API data
			api.setFakeData(
				'collection',
				apiParams('ant-design'),
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/ant-design.json', 'utf8')
				)
			);
			api.setFakeData(
				'collection',
				apiParams('el'),
				JSON.parse(fs.readFileSync(__dirname + '/fixtures/el.json', 'utf8'))
			);
			api.setFakeData(
				'search',
				{
					query: 'home',
					limit: 64,
				},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/search-home.json', 'utf8')
				)
			);

			// Subscribe to event
			events.subscribe('view-loaded', view => {
				counter++;

				if (counter === 1) {
					// Search has loaded
					expect(view).to.be.equal(search);
					expect(view.type).to.be.equal('search');

					// Test collections list
					let blocks = view.render();
					expect(blocks.collections.empty()).to.be.equal(false);
					expect(blocks.collections.filters).to.be.eql(expectedCollections);
					expect(blocks.collections.active).to.be.eql([]);

					// Collection filter
					collection = blocks.collections.action('ant-design');
					expect(collection).to.not.be.equal(search);
					expect(collection.parent).to.be.equal(search);
					expect(collection.type).to.be.equal('collection');
					expect(collection.route.params.prefix).to.be.equal('ant-design');
					expect(collection.loading).to.be.equal(true);
				}

				if (counter === 2) {
					// Collection has loaded
					expect(view).to.be.equal(collection);
					expect(view.type).to.be.equal('collection');

					let blocks = view.render();

					// Should show only 3 "home" icons
					expect(blocks.icons.icons.length).to.be.equal(3);

					// Should include collections filter
					expect(blocks.collections.empty()).to.be.equal(false);
					expect(blocks.collections.filters).to.be.eql(expectedCollections);
					expect(blocks.collections.active).to.be.eql(['ant-design']);

					// Filter another collection
					collection2 = view.action('collections', 'el');
					expect(collection2).to.not.be.equal(search);
					expect(collection2).to.not.be.equal(collection);
					expect(collection2.parent).to.be.equal(search);
					expect(collection2.type).to.be.equal('collection');
					expect(collection2.route.params.prefix).to.be.equal('el');
					expect(collection2.loading).to.be.equal(true);
				}

				if (counter === 3) {
					// Second collection has loaded
					expect(view).to.be.equal(collection2);
					expect(view.type).to.be.equal('collection');

					let blocks = view.render();

					// Should show only 3 "home" icons
					expect(blocks.icons.icons.length).to.be.equal(3);

					// Should include collections filter
					expect(blocks.collections.empty()).to.be.equal(false);
					expect(blocks.collections.filters).to.be.eql(expectedCollections);
					expect(blocks.collections.active).to.be.eql(['el']);

					done();
				}
			});

			// Create view
			search = searchView(
				instance,
				{
					search: 'home',
				},
				null
			);
		});

		it('search from search results', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				counter = 0,
				search,
				search2,
				search3;

			// Set config
			instance.get('config').set('itemsPerPage', 24);
			instance.get('config').set('search.limit', 64);

			// Set API data
			api.setFakeData(
				'search',
				{
					query: 'home',
					limit: 64,
				},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/search-home.json', 'utf8')
				)
			);
			api.setFakeData(
				'search',
				{
					query: 'nav',
					limit: 64,
				},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/search-nav.json', 'utf8')
				)
			);
			api.setFakeData(
				'search',
				{
					query: 'qwerty',
					limit: 64,
				},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/search-qwerty.json', 'utf8')
				)
			);

			// Subscribe to event
			events.subscribe('view-loaded', view => {
				counter++;

				if (counter === 1) {
					// Search has loaded
					expect(view).to.be.equal(search);
					expect(view.type).to.be.equal('search');
					expect(view.loading).to.be.equal(false);
					expect(view.empty).to.be.equal(false);
					expect(view.getRoute()).to.be.eql({
						type: 'search',
						params: {
							search: 'nav',
							page: 1,
						},
					});

					// Test collections list
					let blocks = view.render();
					expect(blocks.collections.empty()).to.be.equal(false);
					expect(blocks.collections.filters).to.be.eql({
						cryptocurrency: 'Cryptocurrency Icons',
						ei: 'Evil Icons',
						feather: 'Feather Icons',
						ic: 'Google Material Icons',
						ion: 'IonIcons',
						mdi: 'Material Design Icons',
						uil: 'Unicons',
						vs: 'Vesper Icons',
						whh: 'WebHostingHub Glyphs',
						zmdi: 'Material Design Iconic Font',
					});
					expect(blocks.collections.active).to.be.eql([]);
					expect(blocks.pagination.length).to.be.equal(27);
					expect(blocks.pagination.page).to.be.equal(1);

					// Change search value without changing view
					search2 = search.action('search', 'arrow', true);
					expect(search2).to.be.equal(view);
					blocks = view.render();
					expect(blocks.search.keyword).to.be.equal('nav');
					expect(blocks.search.value).to.be.equal('arrow');

					// Change search to "home"
					search2 = search.action('search', 'home');
					expect(search2).to.not.be.equal(view);
					expect(search2.loading).to.be.equal(true);
				}

				if (counter === 2) {
					// Second search
					expect(view).to.be.equal(search2);
					expect(view.type).to.be.equal('search');
					expect(view.loading).to.be.equal(false);
					expect(view.empty).to.be.equal(false);
					expect(view.getRoute()).to.be.eql({
						type: 'search',
						params: {
							search: 'home',
						},
					});

					// Test collections list
					let blocks = view.render();
					expect(blocks.collections.empty()).to.be.equal(false);
					expect(blocks.collections.filters).to.be.eql({
						'ant-design': 'Ant Design Icons',
						'bytesize': 'Bytesize Icons',
						'dashicons': 'Dashicons',
						'el': 'Elusive Icons',
						'entypo': 'Entypo+',
						'fa-solid': 'Font Awesome 5 Solid',
						'fe': 'Feather Icon',
						'feather': 'Feather Icons',
						'flat-color-icons': 'Flat Color Icons',
						'foundation': 'Foundation',
						'ic': 'Google Material Icons',
						'icomoon-free': 'IcoMoon Free',
						'icons8': 'Icons8 Windows 10 Icons',
						'ion': 'IonIcons',
						'jam': 'Jam Icons',
						'maki': 'Maki',
						'map': 'Map Icons',
						'mdi': 'Material Design Icons',
						'mdi-light': 'Material Design Light',
						'octicon': 'Octicons',
						'oi': 'Open Iconic',
						'raphael': 'Raphael',
						'si-glyph': 'SmartIcons Glyph',
						'subway': 'Subway Icon Set',
					});
					expect(blocks.collections.active).to.be.eql([]);
					expect(blocks.pagination.length).to.be.equal(64);
					expect(blocks.pagination.page).to.be.equal(0); // Page should have reset

					// Change page
					blocks.pagination.action(2);

					// Change search to "qwerty"
					search3 = blocks.search.action('qwerty');
					expect(search3).to.not.be.equal(view);
					expect(search3.loading).to.be.equal(true);
				}

				if (counter === 3) {
					// Third search
					expect(view).to.be.equal(search3);
					expect(view.type).to.be.equal('search');
					expect(view.loading).to.be.equal(false);
					expect(view.empty).to.be.equal(true);
					expect(view.getRoute()).to.be.eql({
						type: 'search',
						params: {
							search: 'qwerty',
						},
					});

					// Test collections list
					let blocks = view.render();
					expect(blocks.collections.empty()).to.be.equal(true);
					expect(blocks.pagination.length).to.be.equal(0);
					expect(blocks.pagination.page).to.be.equal(0);

					done();
				}
			});

			// Create view
			search = searchView(
				instance,
				{
					search: 'nav',
					page: 1,
				},
				null
			);
		});
	});
})();
