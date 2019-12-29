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
	const collectionsView = require('../src/core/views/collections');

	const chai = require('chai'),
		expect = chai.expect,
		should = chai.should();

	describe('Testing collections view', () => {
		const generalPrefixes = [
			'mdi',
			'mdi-light',
			'ic',
			'uil',
			'jam',
			'ion',
			'fa-solid',
			'fa-regular',
			'vaadin',
			'icomoon-free',
			'dashicons',
			'entypo',
			'flat-color-icons',
			'ant-design',
			'feather',
			'fe',
			'gridicons',
			'ps',
			'el',
			'foundation',
			'typcn',
			'subway',
			'raphael',
			'icons8',
			'wpf',
			'iwwa',
			'topcoat',
			'ei',
			'bytesize',
			'maki',
			'oi',
			'octicon',
			'et',
			'fa',
			'zmdi',
			'whh',
			'si-glyph',
			'ls',
			'simple-line-icons',
			'flat-ui',
			'vs',
			'websymbol',
			'il',
			'bpmn',
			'fontelico',
		];
		const emojiPrefixes = [
			'noto',
			'noto-v1',
			'twemoji',
			'emojione',
			'emojione-monotone',
			'emojione-v1',
			'fxemoji',
		];

		let nsCounter = 0;

		function customSearch(params) {
			if (params.namespace === void 0) {
				params.namespace = __filename + nsCounter++;
			}
			let search = Search.init(params);
			search._data.api = fakeAPI(search);
			return search;
		}

		it('basic list', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				viewItem;

			// Set API data
			api.setFakeData(
				'collections',
				{},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')
				),
				20
			);

			// Subscribe to event
			events.subscribe('view-loaded', view => {
				expect(view).to.be.equal(viewItem);
				expect(view.loading).to.be.equal(false);
				expect(view.empty).to.be.equal(false);

				// Test route
				expect(view.route).to.be.eql({
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
				expect(view.getRoute()).to.be.eql({
					type: 'collections',
				});

				let blocks = view.render();

				// Check categories block
				expect(blocks.categories.empty()).to.be.equal(false);
				expect(blocks.categories.filters).to.be.eql({
					General: 'General',
					Emoji: 'Emoji',
					Thematic: 'Thematic',
				});
				expect(blocks.categories.active).to.be.eql([]);

				// Check collections block
				expect(blocks.collections.empty()).to.be.equal(false);
				expect(blocks.collections.showCategories).to.be.equal(true);
				expect(Object.keys(blocks.collections.collections)).to.be.eql([
					'General',
					'Emoji',
					'Thematic',
				]);
				expect(Object.keys(blocks.collections.collections.General)).to.be.eql(
					generalPrefixes
				);
				expect(Object.keys(blocks.collections.collections.Emoji)).to.be.eql(
					emojiPrefixes
				);

				// Action: filter icons
				expect(blocks.filter.action('Awesome')).to.be.equal(view);
				blocks = view.render();

				expect(view.getRoute()).to.be.eql({
					type: 'collections',
					params: {
						filter: 'Awesome',
					},
				});

				expect(blocks.collections.empty()).to.be.equal(false);
				expect(blocks.collections.showCategories).to.be.equal(true);
				expect(Object.keys(blocks.collections.collections)).to.be.eql([
					'General',
					'Thematic',
				]);
				expect(Object.keys(blocks.collections.collections.General)).to.be.eql([
					'fa-solid',
					'fa-regular',
					'fa',
				]);

				// Another filter
				expect(view.action('filter', 'mdi')).to.be.equal(view);
				blocks = view.render();

				expect(view.getRoute()).to.be.eql({
					type: 'collections',
					params: {
						filter: 'mdi',
					},
				});

				expect(blocks.collections.empty()).to.be.equal(false);
				expect(blocks.collections.showCategories).to.be.equal(true);
				expect(Object.keys(blocks.collections.collections)).to.be.eql([
					'General',
				]);
				expect(Object.keys(blocks.collections.collections.General)).to.be.eql([
					'mdi',
					'mdi-light',
					'zmdi',
				]);

				done();
			});

			// Create view
			viewItem = collectionsView(instance, {}, null);
			expect(viewItem.loading).to.be.equal(true);

			// Test empty render()
			let blocks = viewItem.render();
			expect(blocks.categories.empty()).to.be.equal(true);
			expect(blocks.collections.empty()).to.be.equal(true);
		});

		it('one category', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				viewItem;

			// Set API data
			api.setFakeData(
				'collections',
				{},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')
				),
				20
			);

			// Subscribe to event
			events.subscribe('view-loaded', view => {
				expect(view).to.be.equal(viewItem);
				expect(view.loading).to.be.equal(false);
				expect(view.empty).to.be.equal(false);

				// Test route
				expect(view.route).to.be.eql({
					type: 'collections',
					params: {
						category: 'Emoji',
						filter: '',
						search: '',
					},
					defaults: {
						category: null,
						filter: '',
						search: '',
					},
				});
				expect(view.getRoute()).to.be.eql({
					type: 'collections',
					params: {
						category: 'Emoji',
					},
				});

				let blocks = view.render();

				// Check categories block
				expect(blocks.categories.empty()).to.be.equal(false);
				expect(blocks.categories.filters).to.be.eql({
					General: 'General',
					Emoji: 'Emoji',
					Thematic: 'Thematic',
				});
				expect(blocks.categories.active).to.be.eql(['Emoji']);

				// Check collections block
				expect(blocks.collections.empty()).to.be.equal(false);
				expect(blocks.collections.showCategories).to.be.equal(true);
				expect(Object.keys(blocks.collections.collections)).to.be.eql([
					'Emoji',
				]);
				expect(Object.keys(blocks.collections.collections.Emoji)).to.be.eql(
					emojiPrefixes
				);

				// Test action: changing category
				expect(blocks.categories.action('General')).to.be.equal(view);
				blocks = view.render();

				expect(view.getRoute()).to.be.eql({
					type: 'collections',
					params: {
						category: 'General',
					},
				});

				// Check collections block
				expect(blocks.collections.empty()).to.be.equal(false);
				expect(blocks.collections.showCategories).to.be.equal(true);
				expect(Object.keys(blocks.collections.collections)).to.be.eql([
					'General',
				]);
				expect(Object.keys(blocks.collections.collections.General)).to.be.eql(
					generalPrefixes
				);

				done();
			});

			// Create view
			viewItem = collectionsView(
				instance,
				{
					category: 'Emoji',
				},
				null
			);
			expect(viewItem.loading).to.be.equal(true);
		});

		it('set prefixes', done => {
			let instance = customSearch({
					prefixes: ['fa', 'fa-'],
				}),
				api = instance.get('api'),
				events = instance.get('events'),
				viewItem;

			// Set API data
			api.setFakeData(
				'collections',
				{},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')
				),
				20
			);

			// Subscribe to event
			events.subscribe('view-loaded', view => {
				expect(view).to.be.equal(viewItem);
				expect(view.loading).to.be.equal(false);
				expect(view.empty).to.be.equal(false);

				// Test route
				expect(view.route).to.be.eql({
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
				expect(view.getRoute()).to.be.eql({
					type: 'collections',
				});

				let blocks = view.render();

				// Check categories block
				expect(blocks.categories.empty()).to.be.equal(false);
				expect(blocks.categories.filters).to.be.eql({
					General: 'General',
					Thematic: 'Thematic',
				});
				expect(blocks.categories.active).to.be.eql([]);

				// Check collections block
				expect(blocks.collections.empty()).to.be.equal(false);
				expect(blocks.collections.showCategories).to.be.equal(true);
				expect(Object.keys(blocks.collections.collections)).to.be.eql([
					'General',
					'Thematic',
				]);
				expect(Object.keys(blocks.collections.collections.General)).to.be.eql([
					'fa-solid',
					'fa-regular',
					'fa',
				]);

				done();
			});

			// Create view
			viewItem = collectionsView(instance, {}, null);
			expect(viewItem.loading).to.be.equal(true);
		});

		it('from route', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				viewItem;

			// Set API data
			api.setFakeData(
				'collections',
				{},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')
				),
				20
			);

			// Subscribe to event
			events.subscribe('view-loaded', view => {
				expect(view).to.be.equal(viewItem);
				expect(view.loading).to.be.equal(false);
				expect(view.empty).to.be.equal(false);

				// Test route
				expect(view.route).to.be.eql({
					type: 'collections',
					params: {
						category: 'Thematic',
						filter: '',
						search: '',
					},
					defaults: {
						category: null,
						filter: '',
						search: '',
					},
				});
				expect(view.getRoute()).to.be.eql({
					type: 'collections',
					params: {
						category: 'Thematic',
					},
				});

				let blocks = view.render();

				// Check categories block
				expect(blocks.categories.empty()).to.be.equal(false);
				expect(blocks.categories.filters).to.be.eql({
					General: 'General',
					Emoji: 'Emoji',
					Thematic: 'Thematic',
				});
				expect(blocks.categories.active).to.be.eql(['Thematic']);

				// Check collections block
				expect(blocks.collections.empty()).to.be.equal(false);
				expect(blocks.collections.showCategories).to.be.equal(true);
				expect(Object.keys(blocks.collections.collections)).to.be.eql([
					'Thematic',
				]);

				done();
			});

			// Create view
			viewItem = collectionsView(
				instance,
				{
					routeParams: {
						category: 'Thematic',
					},
				},
				null
			);
			expect(viewItem.loading).to.be.equal(true);
		});

		it('loading collections data', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				config = instance.get('config'),
				events = instance.get('events'),
				collections = instance.get('collections'),
				triggered = {},
				viewItem;

			// Set API data
			api.setFakeData(
				'collections',
				{},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')
				),
				20
			);

			// Check if test is done
			let check = () => {
				if (triggered['view-loaded'] && triggered['collections-loaded']) {
					let base = config.get('API.URI');
					expect(api.log).to.be.eql([
						base + 'collections?version=' + api._version,
					]);
					done();
				}
			};

			// Subscribe to events
			events.subscribe('view-loaded', view => {
				expect(view).to.be.equal(viewItem);
				expect(view.loading).to.be.equal(false);
				expect(view.empty).to.be.equal(false);
				expect(triggered['view-loaded']).to.be.equal(void 0);
				triggered['view-loaded'] = true;

				check();
			});

			events.subscribe('collections-loaded', param => {
				expect(param).to.be.equal(collections);
				expect(triggered['collections-loaded']).to.be.equal(void 0);
				triggered['collections-loaded'] = true;

				check();
			});

			// Create view
			viewItem = collectionsView(instance, {}, null);
			expect(viewItem.loading).to.be.equal(true);

			// Get collections
			expect(collections.loaded('fa')).to.be.equal(false);
		});
	});
})();
