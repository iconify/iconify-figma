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
	const collectionFunctions = require('../src/core/helpers/collection');

	const chai = require('chai'),
		expect = chai.expect,
		should = chai.should();

	describe('Testing collections', () => {
		let nsCounter = 0;

		function customSearch(params) {
			if (params.namespace === void 0) {
				params.namespace = __filename + nsCounter++;
			}
			let search = Search.init(params);
			search._data.api = fakeAPI(search);
			return search;
		}

		it('loading collections', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				collections = instance.get('collections');

			// Set API data
			api.setFakeData(
				'collections',
				{},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')
				),
				0
			);

			// Check if "fa" has been loaded
			expect(collections.loaded('fa')).to.be.equal(false);
			expect(collections.get('fa')).to.be.equal(null);

			// Allow API to load
			setTimeout(() => {
				// Double delay: one for API query, one for API response
				setTimeout(() => {
					expect(collections.loaded('fa')).to.be.equal(true);
					expect(collections.get('fa')).to.be.eql({
						prefix: 'fa',
						title: 'Font Awesome 4',
						total: 678,
						author: {
							name: 'Dave Gandy',
							url: 'http://fontawesome.io/',
						},
						license: {
							title: 'Open Font License',
							url:
								'http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL',
						},
						samples: ['wrench', 'bell-o', 'user-o'],
						version: '4.7.0',
						palette: 'Colorless',
						category: 'General',
					});
					done();
				});
			});
		});

		it('set custom data', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				collections = instance.get('collections');

			// Set API data
			api.setFakeData(
				'collections',
				{},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')
				),
				0
			);

			// Set "mdi" data with wrong icons count to check for data overwrite
			collections.set(
				'mdi',
				collectionFunctions.convertInfo({
					title: 'Material Design Icons',
					total: 1000, // wrong count
					author: 'Austin Andrews',
					url: 'https://github.com/Templarian/MaterialDesign',
					license: 'OFL-1.1',
					licenseURL:
						'https://raw.githubusercontent.com/Templarian/MaterialDesign/master/LICENSE',
					height: 24,
					samples: ['account-check', 'bell-alert-outline', 'calendar-edit'],
					palette: 'Colorless',
					category: 'General',
				})
			);

			// Check if "mdi" has been loaded
			expect(collections.loaded('mdi')).to.be.equal(true);
			expect(collections.get('mdi').total).to.be.equal(1000);
			expect(collections.get('mdi').title).to.be.equal('Material Design Icons');

			// Allow API to load
			setTimeout(() => {
				// Double delay: one for API query, one for API response
				setTimeout(() => {
					expect(collections.loaded('mdi')).to.be.equal(true);
					// Make sure data was not modified
					expect(collections.get('mdi').total).to.be.equal(1000);
					done();
				});
			});
		});

		it('overwrite custom data', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				collections = instance.get('collections');

			// Set API data
			api.setFakeData(
				'collections',
				{},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')
				),
				0
			);

			// Set "mdi" data with wrong icons count to check for data overwrite
			collections.set(
				'mdi',
				collectionFunctions.convertInfo({
					name: 'Material Design Icons',
					total: 1000, // wrong count
					author: 'Austin Andrews',
					url: 'https://github.com/Templarian/MaterialDesign',
					license: 'OFL-1.1',
					licenseURL:
						'https://raw.githubusercontent.com/Templarian/MaterialDesign/master/LICENSE',
					height: 24,
					samples: ['account-check', 'bell-alert-outline', 'calendar-edit'],
					palette: 'Colorless',
					category: 'General',
				})
			);

			// Check if "mdi" has been loaded
			expect(collections.loaded('mdi')).to.be.equal(true);
			expect(collections.get('mdi').total).to.be.equal(1000);

			// Make sure 'name' was changed to 'title'
			expect(collections.get('mdi').title).to.be.equal('Material Design Icons');

			// Check for mdi-light. This should trigger reloading collections, which should set different "total" for mdi
			expect(collections.loaded('mdi-light')).to.be.equal(false);

			// Allow API to load
			setTimeout(() => {
				// Double delay: one for API query, one for API response
				setTimeout(() => {
					expect(collections.loaded('mdi')).to.be.equal(true);
					// Make sure data was modified
					expect(collections.get('mdi').total).to.be.equal(3794);
					done();
				});
			});
		});

		it('collections + events', done => {
			let instance = customSearch({}),
				api = instance.get('api'),
				events = instance.get('events'),
				collections = instance.get('collections');

			// Set API data
			api.setFakeData(
				'collections',
				{},
				JSON.parse(
					fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')
				),
				20
			);

			// Check if "fa" has been loaded
			expect(collections.loaded('fa')).to.be.equal(false);

			// Subscribe to event
			events.subscribe('collections-loaded', collections2 => {
				expect(collections2).to.be.equal(collections);
				expect(collections.loaded('fa')).to.be.equal(true);
				done();
			});
		});
	});
})();
