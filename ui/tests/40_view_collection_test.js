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

	const chai = require('chai'),
		expect = chai.expect,
		should = chai.should();

	describe('Testing collection view', () => {
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

		it('basic list', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				viewItem;

			// Set config
			instance.get('config').set('itemsPerPage', 48);

			// Set API data
			api.setFakeData(
				'collection',
				apiParams('fa-regular'),
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/fa-regular.json', 'utf8')
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
					type: 'collection',
					params: {
						prefix: 'fa-regular',
						page: 3,
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
				expect(view.getRoute()).to.be.eql({
					type: 'collection',
					params: {
						prefix: 'fa-regular',
						page: 3,
					},
				});

				let blocks = view.render();

				// Check filter blocks
				expect(blocks.tags.empty()).to.be.equal(false);
				expect(blocks.themePrefixes.empty()).to.be.equal(true);
				expect(blocks.themeSuffixes.empty()).to.be.equal(true);

				expect(Object.keys(blocks.tags.filters).length).to.be.equal(52);
				expect(blocks.tags.active).to.be.eql([]);

				// Check pagination block
				expect(blocks.pagination.empty()).to.be.equal(false);
				expect(blocks.pagination.length).to.be.equal(151);
				expect(blocks.pagination.perPage).to.be.equal(48);
				expect(blocks.pagination.page).to.be.equal(3);

				// Check icons block
				expect(blocks.icons.empty()).to.be.equal(false);
				expect(blocks.icons.icons.length).to.be.equal(7); // 151 - 48 * 3

				// Check for window-minimize
				expect(
					blocks.icons.icons.filter(icon => icon.name === 'window-minimize')
						.length
				).to.be.equal(1);

				// Remember first icon
				let first = blocks.icons.icons[0].name;

				// Set second page
				view.route.params.page = 2;
				blocks = view.render();

				// Check pagination block
				expect(blocks.pagination.empty()).to.be.equal(false);
				expect(blocks.pagination.length).to.be.equal(151);
				expect(blocks.pagination.perPage).to.be.equal(48);
				expect(blocks.pagination.page).to.be.equal(2);

				// Check icons block
				expect(blocks.icons.empty()).to.be.equal(false);
				expect(blocks.icons.icons.length).to.be.equal(48);

				// Check for first icon of third page to avoid duplicates
				expect(
					blocks.icons.icons.filter(icon => icon.name === first).length
				).to.be.equal(0);

				done();
			});

			// Create view
			viewItem = collectionView(
				instance,
				{
					prefix: 'fa-regular',
					page: 3, // last page
				},
				null
			);
			expect(viewItem.loading).to.be.equal(true);

			// Test empty render()
			let blocks = viewItem.render();
			expect(blocks.tags.empty()).to.be.equal(true);
			expect(blocks.themePrefixes.empty()).to.be.equal(true);
			expect(blocks.themeSuffixes.empty()).to.be.equal(true);
			expect(blocks.icons.empty()).to.be.equal(true);
			expect(blocks.pagination.empty()).to.be.equal(true);
		});

		it('filter by tag', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				viewItem;

			// Set config
			instance.get('config').set('itemsPerPage', 48);

			// Set API data
			api.setFakeData(
				'collection',
				apiParams('fa-regular'),
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/fa-regular.json', 'utf8')
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
					type: 'collection',
					params: {
						prefix: 'fa-regular',
						page: 0,
						search: '',
						tag: 'Energy',
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
				expect(view.getRoute()).to.be.eql({
					type: 'collection',
					params: {
						prefix: 'fa-regular',
						tag: 'Energy',
					},
				});

				let blocks = view.render();

				// Check filter blocks
				expect(blocks.tags.empty()).to.be.equal(false);
				expect(blocks.themePrefixes.empty()).to.be.equal(true);
				expect(blocks.themeSuffixes.empty()).to.be.equal(true);

				expect(Object.keys(blocks.tags.filters).length).to.be.equal(52);
				expect(blocks.tags.active).to.be.eql(['Energy']);

				// Check pagination block
				expect(blocks.pagination.empty()).to.be.equal(true);
				expect(blocks.pagination.length).to.be.equal(2);
				expect(blocks.pagination.perPage).to.be.equal(48);
				expect(blocks.pagination.page).to.be.equal(0);

				// Check icons block
				expect(blocks.icons.empty()).to.be.equal(false);
				expect(blocks.icons.icons.length).to.be.equal(2);

				expect(blocks.icons.icons[0].name).to.be.equal('lightbulb');
				expect(blocks.icons.icons[1].name).to.be.equal('sun');

				done();
			});

			// Create view
			viewItem = collectionView(
				instance,
				{
					prefix: 'fa-regular',
					tag: 'Energy',
				},
				null
			);
			expect(viewItem.loading).to.be.equal(true);
		});

		it('filter uncategorized', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				viewItem;

			// Set config
			instance.get('config').set('itemsPerPage', 48);

			// Set API data
			api.setFakeData(
				'collection',
				apiParams('mdi'),
				JSON.parse(fs.readFileSync(__dirname + '/fixtures/mdi.json', 'utf8')),
				20
			);

			// Subscribe to event
			events.subscribe('view-loaded', view => {
				expect(view).to.be.equal(viewItem);
				expect(view.loading).to.be.equal(false);
				expect(view.empty).to.be.equal(false);

				// Test route
				expect(view.route).to.be.eql({
					type: 'collection',
					params: {
						prefix: 'mdi',
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
				expect(view.getRoute()).to.be.eql({
					type: 'collection',
					params: {
						prefix: 'mdi',
					},
				});

				let blocks = view.render();

				// Check filter blocks
				expect(blocks.tags.empty()).to.be.equal(false);
				expect(blocks.themePrefixes.empty()).to.be.equal(true);
				expect(blocks.themeSuffixes.empty()).to.be.equal(true);

				expect(Object.keys(blocks.tags.filters).length).to.be.equal(60);
				expect(blocks.tags.active).to.be.eql([]);
				expect(blocks.tags.disabled).to.be.eql([]);

				// Check icons and pagination blocks
				expect(blocks.icons.empty()).to.be.equal(false);
				expect(blocks.pagination.empty()).to.be.equal(false);
				expect(blocks.pagination.length).to.be.equal(4621);

				// Filter uncategorized
				view.action('tags', '');
				blocks = view.render();

				expect(blocks.icons.empty()).to.be.equal(false);
				expect(blocks.pagination.empty()).to.be.equal(false);
				expect(blocks.pagination.length).to.be.equal(1497);

				done();
			});

			// Create view
			viewItem = collectionView(
				instance,
				{
					prefix: 'mdi',
				},
				null
			);
			expect(viewItem.loading).to.be.equal(true);
		});

		it('filter by suffix', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				viewItem;

			// Set config
			instance.get('config').set('itemsPerPage', 100);

			// Set API data
			api.setFakeData(
				'collection',
				apiParams('ant-design'),
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/ant-design.json', 'utf8')
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
					type: 'collection',
					params: {
						prefix: 'ant-design',
						page: 3,
						search: '',
						tag: null,
						themePrefix: null,
						themeSuffix: 'Outline',
					},
					defaults: {
						page: 0,
						search: '',
						tag: null,
						themePrefix: null,
						themeSuffix: null,
					},
				});
				expect(view.getRoute()).to.be.eql({
					type: 'collection',
					params: {
						prefix: 'ant-design',
						page: 3,
						themeSuffix: 'Outline',
					},
				});

				let blocks = view.render();

				// Check filter blocks
				expect(blocks.tags.empty()).to.be.equal(true);
				expect(blocks.themePrefixes.empty()).to.be.equal(true);
				expect(blocks.themeSuffixes.empty()).to.be.equal(false);

				expect(blocks.themeSuffixes.filters).to.be.eql({
					Fill: 'Fill',
					Outline: 'Outline',
					TwoTone: 'TwoTone',
				});
				expect(blocks.themeSuffixes.active).to.be.eql(['Outline']);

				// Check pagination block
				expect(blocks.pagination.empty()).to.be.equal(false);
				expect(blocks.pagination.length).to.be.equal(366);
				expect(blocks.pagination.perPage).to.be.equal(100);
				expect(blocks.pagination.page).to.be.equal(3);

				// Check icons block
				expect(blocks.icons.empty()).to.be.equal(false);
				expect(blocks.icons.icons.length).to.be.equal(66); // 366 icons

				// Check for usb-*
				expect(
					blocks.icons.icons.filter(
						icon => icon.name.split('-').shift() === 'usb'
					)
				).to.be.eql([
					{
						prefix: 'ant-design',
						name: 'usb-outline',
						themeSuffix: 'Outline',
					},
				]);

				done();
			});

			// Create view
			viewItem = collectionView(
				instance,
				{
					prefix: 'ant-design',
					themeSuffix: 'Outline',
					page: 3,
				},
				null
			);
			expect(viewItem.loading).to.be.equal(true);
		});

		it('filter by keyword', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				viewItem;

			// Set config
			instance.get('config').set('itemsPerPage', 100);

			// Set API data
			api.setFakeData(
				'collection',
				apiParams('fa'),
				JSON.parse(fs.readFileSync(__dirname + '/fixtures/fa.json', 'utf8')),
				20
			);

			// Subscribe to event
			events.subscribe('view-loaded', view => {
				expect(view).to.be.equal(viewItem);
				expect(view.loading).to.be.equal(false);
				expect(view.empty).to.be.equal(false);

				// Test route
				expect(view.route).to.be.eql({
					type: 'collection',
					params: {
						prefix: 'fa',
						page: 0,
						search: 'link',
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
				expect(view.getRoute()).to.be.eql({
					type: 'collection',
					params: {
						prefix: 'fa',
						search: 'link',
					},
				});

				let blocks = view.render();

				// Check filter blocks
				expect(blocks.tags.empty()).to.be.equal(true);
				expect(blocks.themePrefixes.empty()).to.be.equal(true);
				expect(blocks.themeSuffixes.empty()).to.be.equal(true);

				// Check pagination block
				expect(blocks.pagination.empty()).to.be.equal(true);
				expect(blocks.pagination.length).to.be.equal(6);
				expect(blocks.pagination.page).to.be.equal(0);

				// Check icons block
				expect(blocks.icons.empty()).to.be.equal(false);
				expect(blocks.icons.icons.length).to.be.equal(6); // 6 matches: 4 icons, 2 aliases

				expect(blocks.icons.icons).to.be.eql([
					{
						prefix: 'fa',
						name: 'chain',
						aliases: ['link'],
						chars: ['f0c1'],
					},
					{
						prefix: 'fa',
						name: 'chain-broken',
						aliases: ['unlink'],
						chars: ['f127'],
					},
					{
						prefix: 'fa',
						name: 'external-link',
						chars: ['f08e'],
					},
					{
						prefix: 'fa',
						name: 'external-link-square',
						chars: ['f14c'],
					},
					{
						prefix: 'fa',
						name: 'linkedin',
						chars: ['f0e1'],
					},
					{
						prefix: 'fa',
						name: 'linkedin-square',
						chars: ['f08c'],
					},
				]);

				// Search for character, exclude matches with "o"
				view.route.params.search = 'f01 -o';
				blocks = view.render();

				expect(blocks.icons.empty()).to.be.equal(false);
				expect(blocks.icons.icons.length).to.be.equal(2);

				expect(blocks.icons.icons).to.be.eql([
					{
						prefix: 'fa',
						name: 'search-minus',
						chars: ['f010'],
					},
					{
						prefix: 'fa',
						name: 'signal',
						chars: ['f012'],
					},
				]);

				done();
			});

			// Create view
			viewItem = collectionView(
				instance,
				{
					routeParams: {
						prefix: 'fa',
						search: 'link',
					},
				},
				null
			);
			expect(viewItem.loading).to.be.equal(true);
		});

		it('filter action: add suffix', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				viewItem;

			// Set config
			instance.get('config').set('itemsPerPage', 100);

			// Set API data
			api.setFakeData(
				'collection',
				apiParams('ant-design'),
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/ant-design.json', 'utf8')
				),
				20
			);

			// Subscribe to event
			events.subscribe('view-loaded', view => {
				expect(view).to.be.equal(viewItem);
				expect(view.loading).to.be.equal(false);
				expect(view.empty).to.be.equal(false);

				// Get blocks and change filter
				let blocks = view.render();
				expect(blocks.themeSuffixes).to.not.be.equal(void 0);
				expect(blocks.themeSuffixes.action('Outline')).to.be.equal(view);

				// Test route
				expect(view.route).to.be.eql({
					type: 'collection',
					params: {
						prefix: 'ant-design',
						page: 0,
						search: '',
						tag: null,
						themePrefix: null,
						themeSuffix: 'Outline',
					},
					defaults: {
						page: 0,
						search: '',
						tag: null,
						themePrefix: null,
						themeSuffix: null,
					},
				});
				expect(view.getRoute()).to.be.eql({
					type: 'collection',
					params: {
						prefix: 'ant-design',
						themeSuffix: 'Outline',
					},
				});

				blocks = view.render();

				// Check filter blocks
				expect(blocks.tags.empty()).to.be.equal(true);
				expect(blocks.themePrefixes.empty()).to.be.equal(true);
				expect(blocks.themeSuffixes.empty()).to.be.equal(false);

				expect(blocks.themeSuffixes.filters).to.be.eql({
					Fill: 'Fill',
					Outline: 'Outline',
					TwoTone: 'TwoTone',
				});
				expect(blocks.themeSuffixes.active).to.be.eql(['Outline']);

				// Check pagination block
				expect(blocks.pagination.empty()).to.be.equal(false);
				expect(blocks.pagination.length).to.be.equal(366);
				expect(blocks.pagination.perPage).to.be.equal(100);
				expect(blocks.pagination.page).to.be.equal(0);

				// Check icons block
				expect(blocks.icons.empty()).to.be.equal(false);
				expect(blocks.icons.icons.length).to.be.equal(100);

				done();
			});

			// Create view
			viewItem = collectionView(
				instance,
				{
					prefix: 'ant-design',
					page: 3,
				},
				null
			);
			expect(viewItem.loading).to.be.equal(true);
		});

		it('test mix of actions', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				viewItem;

			// Set config
			instance.get('config').set('itemsPerPage', 100);

			// Set API data
			api.setFakeData(
				'collection',
				apiParams('ant-design'),
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/ant-design.json', 'utf8')
				),
				20
			);

			// Subscribe to event
			events.subscribe('view-loaded', view => {
				expect(view).to.be.equal(viewItem);
				expect(view.loading).to.be.equal(false);
				expect(view.empty).to.be.equal(false);

				// Get blocks
				let blocks = view.render();

				// Check pagination block
				expect(blocks.pagination.empty()).to.be.equal(false);
				expect(blocks.pagination.length).to.be.equal(214);
				expect(blocks.pagination.perPage).to.be.equal(100);
				expect(blocks.pagination.page).to.be.equal(2);

				// Change suffix
				expect(blocks.themeSuffixes).to.not.be.equal(void 0);
				expect(blocks.themeSuffixes.action('TwoTone')).to.be.equal(view);
				blocks = view.render();

				// Test route
				expect(view.route).to.be.eql({
					type: 'collection',
					params: {
						prefix: 'ant-design',
						page: 1,
						search: '',
						tag: null,
						themePrefix: null,
						themeSuffix: 'TwoTone',
					},
					defaults: {
						page: 0,
						search: '',
						tag: null,
						themePrefix: null,
						themeSuffix: null,
					},
				});
				expect(view.getRoute()).to.be.eql({
					type: 'collection',
					params: {
						prefix: 'ant-design',
						themeSuffix: 'TwoTone',
						page: 1,
					},
				});

				// Check filter blocks
				expect(blocks.tags.empty()).to.be.equal(true);
				expect(blocks.themePrefixes.empty()).to.be.equal(true);
				expect(blocks.themeSuffixes.empty()).to.be.equal(false);

				expect(blocks.themeSuffixes.filters).to.be.eql({
					Fill: 'Fill',
					Outline: 'Outline',
					TwoTone: 'TwoTone',
				});
				expect(blocks.themeSuffixes.active).to.be.eql(['TwoTone']);

				// Check pagination block
				expect(blocks.pagination.empty()).to.be.equal(false);
				expect(blocks.pagination.length).to.be.equal(148);
				expect(blocks.pagination.perPage).to.be.equal(100);
				expect(blocks.pagination.page).to.be.equal(1);

				// Check icons block
				expect(blocks.icons.empty()).to.be.equal(false);
				expect(blocks.icons.icons.length).to.be.equal(48); // 148 icons

				// Check locating icon
				expect(
					view.getPageForIcon({
						prefix: 'ant-design',
						name: 'api-twotone',
					})
				).to.be.equal(0);

				expect(
					view.getPageForIcon({
						prefix: 'ant-design',
						name: 'tool-twotone',
					})
				).to.be.equal(1);

				expect(
					view.getPageForIcon({
						prefix: 'ant-design',
						name: 'thunderbolt-fill',
					})
				).to.be.equal(false);

				// Change page
				expect(blocks.pagination.action(0)).to.be.equal(view);
				blocks = view.render();

				// Check pagination block
				expect(blocks.pagination.empty()).to.be.equal(false);
				expect(blocks.pagination.length).to.be.equal(148);
				expect(blocks.pagination.perPage).to.be.equal(100);
				expect(blocks.pagination.page).to.be.equal(0);

				// Check icons block
				expect(blocks.icons.empty()).to.be.equal(false);
				expect(blocks.icons.icons.length).to.be.equal(100); // first page

				// Reset suffix
				expect(
					blocks.themeSuffixes.action(blocks.themeSuffixes.active[0])
				).to.be.equal(view);
				blocks = view.render();

				// Check pagination block
				expect(blocks.pagination.empty()).to.be.equal(false);
				expect(blocks.pagination.length).to.be.equal(728);
				expect(blocks.pagination.perPage).to.be.equal(100);
				expect(blocks.pagination.page).to.be.equal(0);

				// Search for 'user-'
				expect(blocks.search.action('user-')).to.be.equal(view);
				blocks = view.render();

				// Check search block
				expect(blocks.search.empty()).to.be.equal(false);
				expect(blocks.search.keyword).to.be.equal('user-');
				expect(blocks.search.value).to.be.equal('user-');

				// Check pagination block
				expect(blocks.pagination.empty()).to.be.equal(true);
				expect(blocks.pagination.length).to.be.equal(3);
				expect(blocks.pagination.page).to.be.equal(0);

				// Check icons block
				expect(blocks.icons.empty()).to.be.equal(false);
				expect(blocks.icons.icons.length).to.be.equal(3); // only 3 icons
				expect(blocks.icons.icons).to.be.eql([
					{
						prefix: 'ant-design',
						name: 'user-add-outline',
						themeSuffix: 'Outline',
					},
					{
						prefix: 'ant-design',
						name: 'user-delete-outline',
						themeSuffix: 'Outline',
					},
					{
						prefix: 'ant-design',
						name: 'user-outline',
						themeSuffix: 'Outline',
					},
				]);

				done();
			});

			// Create view
			viewItem = collectionView(
				instance,
				{
					prefix: 'ant-design',
					themeSuffix: 'Fill',
					page: 4,
				},
				null
			);
			expect(viewItem.loading).to.be.equal(true);
		});
	});
})();
