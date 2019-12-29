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
	const Search = require('../src/core/search');
	const FakeAPI = require('./fake_api');

	const chai = require('chai'),
		expect = chai.expect,
		should = chai.should();

	describe('Testing API', () => {
		let nsCounter = 0;

		function customSearch(params) {
			if (params.namespace === void 0) {
				params.namespace = __filename + nsCounter++;
			}
			let search = Search.init(params);
			search._data.api = FakeAPI(search);
			return search;
		}

		it('node.js API', done => {
			let instance = Search.init({}),
				api = instance.get('api');

			api.load(
				'search',
				{
					query: 'home',
					prefix: 'fa',
				},
				result => {
					expect(result).to.not.be.equal(null);
					expect(result.icons).to.be.eql(['fa:home']);
					done();
				}
			);
		});

		it('fake API, loading on next tick', done => {
			let instance = customSearch({}),
				api = instance.get('api');

			api.setFakeData(
				'foo',
				{},
				{
					foo: 'bar',
					bar: 2,
				}
			);

			api.load('foo', {}, result => {
				expect(result).to.be.eql({
					foo: 'bar',
					bar: 2,
				});
				done();
			});
		});

		it('fake API, loading instantly', done => {
			let instance = customSearch({}),
				api = instance.get('api');

			api.setFakeData(
				'foo',
				{ bar: 1 },
				{
					foo: 'bar',
					bar: 3,
				},
				0
			);

			api.load('foo', { bar: 1 }, result => {
				expect(result).to.be.eql({
					foo: 'bar',
					bar: 3,
				});
				done();
			});
		});

		it('fake API, never loading', function(done) {
			let timeout = 500;
			this.timeout(timeout + 100);
			setTimeout(done, timeout);

			let instance = customSearch({
					config: {
						API: {
							retry: 100,
						},
					},
				}),
				api = instance.get('api');

			api.load('foo', {}, result => {
				done(new Error('Expected timeout'));
			});
		});
	});
})();
