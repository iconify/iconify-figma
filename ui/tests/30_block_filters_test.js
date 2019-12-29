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
	const filters = require('../src/core/blocks/filters');

	const chai = require('chai'),
		expect = chai.expect,
		should = chai.should();

	describe('Testing filters block', () => {
		let nsCounter = 0;

		it('basic blocks', () => {
			let instance = Search.init({
					namespace: __filename + nsCounter++,
				}),
				block;

			// Empty block without parameters
			block = filters(instance, null, {});

			expect(block.filtersType).to.be.equal('');
			expect(block.filters).to.be.eql({});
			expect(block.active).to.be.eql([]);
			expect(block.multiple).to.be.equal(false);
			expect(block.empty()).to.be.equal(true);
			expect(block.toObject()).to.be.eql({
				filtersType: '',
				active: [],
				multiple: false,
				filters: {},
				index: 0,
			});

			// 1 filter
			block = filters(instance, null, {
				filters: {
					foo: 'Foo',
				},
			});
			expect(block.filters).to.be.eql({
				foo: 'Foo',
			});
			expect(block.empty()).to.be.equal(true);

			// 2 filters
			block = filters(instance, null, {
				filters: {
					foo: 'Foo',
					bar: 'Bar',
				},
			});
			expect(block.filters).to.be.eql({
				foo: 'Foo',
				bar: 'Bar',
			});
			expect(block.empty()).to.be.equal(false);
			expect(block.active).to.be.eql([]);

			// Filters as array
			block = filters(instance, null, {
				filters: ['foo', 'bar'],
			});
			expect(block.filters).to.be.eql({
				foo: 'foo',
				bar: 'bar',
			});
			expect(block.empty()).to.be.equal(false);
			expect(block.active).to.be.eql([]);
		});

		it('toggle one filter', () => {
			let instance = Search.init({
					namespace: __filename + nsCounter++,
				}),
				block;

			block = filters(instance, null, {
				filters: ['foo', 'bar'],
				active: ['foo'],
			});
			expect(block.filters).to.be.eql({
				foo: 'foo',
				bar: 'bar',
			});
			expect(block.empty()).to.be.equal(false);
			expect(block.active).to.be.eql(['foo']);

			block.toggle('bar');
			expect(block.active).to.be.eql(['bar']);

			block.select('foo');
			expect(block.active).to.be.eql(['foo']);

			block.deselect('foo');
			expect(block.active).to.be.eql([]);

			block.toggle('foo');
			expect(block.active).to.be.eql(['foo']);
		});

		it('toggle multiple filters', () => {
			let instance = Search.init({
					namespace: __filename + nsCounter++,
				}),
				block;

			block = filters(instance, null, {
				filtersType: 'test',
				filters: ['foo', 'bar', 'baz'],
				active: ['foo'],
				multiple: true,
			});
			expect(block.filters).to.be.eql({
				foo: 'foo',
				bar: 'bar',
				baz: 'baz',
			});
			expect(block.empty()).to.be.equal(false);
			expect(block.active).to.be.eql(['foo']);

			block.toggle('bar');
			expect(block.active).to.be.eql(['foo', 'bar']);

			block.select('foo');
			expect(block.active).to.be.eql(['foo', 'bar']);
			expect(block.toObject()).to.be.eql({
				filtersType: 'test',
				active: ['foo', 'bar'],
				multiple: true,
				filters: {
					foo: 'foo',
					bar: 'bar',
					baz: 'baz',
				},
				index: 0,
			});

			block.deselect('foo');
			expect(block.active).to.be.eql(['bar']);

			block.toggle('foo');
			expect(block.active).to.be.eql(['bar', 'foo']);

			block.toggle('baz'); // Selects all filters
			expect(block.active).to.be.eql([]);
		});
	});
})();
