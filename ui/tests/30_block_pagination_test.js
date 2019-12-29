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
	const pagination = require('../src/core/blocks/pagination');

	const chai = require('chai'),
		expect = chai.expect,
		should = chai.should();

	describe('Testing pagination block', () => {
		let nsCounter = 0;

		it('basic blocks', () => {
			let instance = Search.init({
					namespace: __filename + nsCounter++,
				}),
				perPage = 24,
				block,
				block2;

			instance.get('config').set('itemsPerPage', perPage);

			// Empty block without parameters
			block = pagination(instance, null, {});

			expect(block.length).to.be.equal(0);
			expect(block.perPage).to.be.equal(perPage);
			expect(block.empty()).to.be.equal(true);
			expect(block.page).to.be.equal(0);
			expect(block.maxPage()).to.be.equal(0);

			// Few items, but still 1 page
			block = pagination(instance, null, {
				length: 2,
			});

			expect(block.length).to.be.equal(2);
			expect(block.perPage).to.be.equal(perPage);
			expect(block.empty()).to.be.equal(true);
			expect(block.page).to.be.equal(0);
			expect(block.maxPage()).to.be.equal(0);

			// 1 full page
			block = pagination(instance, null, {
				length: perPage,
			});

			expect(block.length).to.be.equal(perPage);
			expect(block.perPage).to.be.equal(perPage);
			expect(block.empty()).to.be.equal(true);
			expect(block.page).to.be.equal(0);
			expect(block.maxPage()).to.be.equal(0);

			// 2 pages
			block = pagination(instance, null, {
				length: perPage + 1,
			});

			expect(block.length).to.be.equal(perPage + 1);
			expect(block.perPage).to.be.equal(perPage);
			expect(block.empty()).to.be.equal(false);
			expect(block.page).to.be.equal(0);
			expect(block.maxPage()).to.be.equal(1);

			// Test copy and comparision
			block2 = pagination(instance, null, {
				length: perPage * 10,
				page: 100,
			});
			expect(block.compare(block2)).to.be.equal(false);

			expect(block2.length).to.be.equal(perPage * 10);
			expect(block2.perPage).to.be.equal(perPage);
			expect(block2.empty()).to.be.equal(false);
			expect(block2.page).to.be.equal(9);
			expect(block2.maxPage()).to.be.equal(9);

			block2.copyFrom(block);
			expect(block2.length).to.be.equal(perPage + 1);
			expect(block2.perPage).to.be.equal(perPage);
			expect(block2.empty()).to.be.equal(false);
			expect(block2.page).to.be.equal(0);
			expect(block2.maxPage()).to.be.equal(1);
			expect(block.compare(block2)).to.be.equal(true);
		});

		it('invalid values', () => {
			let instance = Search.init({
					namespace: __filename + nsCounter++,
				}),
				perPage = 24,
				block;

			instance.get('config').set('itemsPerPage', perPage);

			// Negative number of items
			block = pagination(instance, null, {
				length: -100,
				page: 10,
			});

			expect(block.empty()).to.be.equal(true);
			expect(block.length).to.be.equal(0);
			expect(block.page).to.be.equal(0);

			// Negative page
			block = pagination(instance, null, {
				length: 100,
				page: -20,
			});

			expect(block.empty()).to.be.equal(false);
			expect(block.length).to.be.equal(100);
			expect(block.page).to.be.equal(0);

			// Page exceeding maximum page
			block = pagination(instance, null, {
				length: perPage * 2,
				page: 2,
			});

			expect(block.empty()).to.be.equal(false);
			expect(block.length).to.be.equal(perPage * 2);
			expect(block.page).to.be.equal(1);

			block = pagination(instance, null, {
				length: perPage * 2 + 1,
				page: 2,
			});

			expect(block.empty()).to.be.equal(false);
			expect(block.length).to.be.equal(perPage * 2 + 1);
			expect(block.page).to.be.equal(2);
		});

		it('pageForIndex', () => {
			let instance = Search.init({
					namespace: __filename + nsCounter++,
				}),
				perPage = 24,
				block;

			instance.get('config').set('itemsPerPage', perPage);

			block = pagination(instance, null, {});

			expect(block.pageForIndex(0)).to.be.equal(0);
			expect(block.pageForIndex(perPage - 1)).to.be.equal(0);
			expect(block.pageForIndex(perPage)).to.be.equal(1);
			expect(block.pageForIndex(perPage * 2 - 1)).to.be.equal(1);
			expect(block.pageForIndex(perPage * 2)).to.be.equal(2);

			// Invalid
			expect(block.pageForIndex(-100)).to.be.equal(0);
		});

		it('pagination - full list', () => {
			let instance = Search.init({
					namespace: __filename + nsCounter++,
				}),
				perPage = 24,
				block;

			instance.get('config').set('itemsPerPage', perPage);

			// Create small blocks
			block = pagination(instance, null, {});
			expect(block.pagination()).to.be.eql([]);

			block = pagination(instance, null, {
				length: perPage,
			});
			expect(block.empty()).to.be.equal(true);
			expect(block.pagination()).to.be.eql([]);

			block = pagination(instance, null, {
				length: perPage,
				more: true,
			});
			expect(block.empty()).to.be.equal(false);
			expect(block.pagination()).to.be.eql(['more']);

			// 2 pages
			block = pagination(instance, null, {
				length: perPage + 1,
			});
			expect(block.pagination()).to.be.eql([0, 1]);

			block = pagination(instance, null, {
				length: perPage + 1,
				more: true,
			});
			expect(block.pagination()).to.be.eql([0, 1, 'more']);

			block = pagination(instance, null, {
				length: perPage * 2,
				page: 1,
			});
			expect(block.pagination()).to.be.eql([0, 1]);

			// First 3 - 12 pages
			block = pagination(instance, null, {
				length: perPage * 3,
			});
			expect(block.pagination()).to.be.eql([0, 1, 2]);

			block = pagination(instance, null, {
				length: perPage * 4,
				page: 3,
			});
			expect(block.pagination()).to.be.eql([0, 1, 2, 3]);

			block = pagination(instance, null, {
				length: perPage * 5,
			});
			expect(block.pagination()).to.be.eql([0, 1, 2, 3, 4]);

			block = pagination(instance, null, {
				length: perPage * 6 - 10,
			});
			expect(block.pagination()).to.be.eql([0, 1, 2, 3, 4, 5]);

			block = pagination(instance, null, {
				length: perPage * 7,
			});
			expect(block.pagination()).to.be.eql([0, 1, 2, 3, 4, 5, 6]);

			block = pagination(instance, null, {
				length: perPage * 8,
			});
			expect(block.pagination()).to.be.eql([0, 1, 2, 3, 4, 5, 6, 7]);

			block = pagination(instance, null, {
				length: perPage * 9,
			});
			expect(block.pagination()).to.be.eql([0, 1, 2, 3, 4, 5, 6, 7, 8]);

			block = pagination(instance, null, {
				length: perPage * 10,
			});
			expect(block.pagination()).to.be.eql([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

			block = pagination(instance, null, {
				length: perPage * 11,
			});
			expect(block.pagination()).to.be.eql([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

			block = pagination(instance, null, {
				length: perPage * 12,
			});
			expect(block.pagination()).to.be.eql([
				0,
				1,
				2,
				3,
				4,
				5,
				6,
				7,
				8,
				9,
				10,
				11,
			]);

			block = pagination(instance, null, {
				length: perPage * 13,
			});
			expect(block.pagination()).to.be.eql([
				0,
				1,
				2,
				3,
				4,
				5,
				6,
				7,
				8,
				9,
				10,
				11,
				12,
			]);
			expect(block.toObject()).to.be.eql({
				length: perPage * 13,
				page: 0,
				more: false,
			});
		});

		it('pagination - partial lists', () => {
			let instance = Search.init({
					namespace: __filename + nsCounter++,
				}),
				perPage = 24,
				block;

			instance.get('config').set('itemsPerPage', perPage);

			// First 3 and last 3
			block = pagination(instance, null, {
				length: perPage * 14,
			});
			expect(block.pagination()).to.be.eql([0, 1, 2, 11, 12, 13]);

			block = pagination(instance, null, {
				length: perPage * 14,
				page: 13,
			});
			expect(block.pagination()).to.be.eql([0, 1, 2, 11, 12, 13]);

			// Add pages at start
			block = pagination(instance, null, {
				length: perPage * 14,
				page: 1,
			});
			expect(block.pagination()).to.be.eql([0, 1, 2, 3, 11, 12, 13]);

			block = pagination(instance, null, {
				length: perPage * 14,
				page: 2,
			});
			expect(block.pagination()).to.be.eql([0, 1, 2, 3, 4, 11, 12, 13]);

			block = pagination(instance, null, {
				length: perPage * 14,
				page: 3,
			});
			expect(block.pagination()).to.be.eql([0, 1, 2, 3, 4, 5, 11, 12, 13]);

			block = pagination(instance, null, {
				length: perPage * 14,
				page: 4,
			});
			expect(block.pagination()).to.be.eql([0, 1, 2, 3, 4, 5, 6, 11, 12, 13]);

			block = pagination(instance, null, {
				length: perPage * 14,
				page: 5,
			});
			expect(block.pagination()).to.be.eql([
				0,
				1,
				2,
				3,
				4,
				5,
				6,
				7,
				11,
				12,
				13,
			]);

			block = pagination(instance, null, {
				length: perPage * 14,
				page: 6,
			});
			expect(block.pagination()).to.be.eql([
				0,
				1,
				2,
				3,
				4,
				5,
				6,
				7,
				8,
				11,
				12,
				13,
			]);

			// Spacing between first 3 and current - 2
			block = pagination(instance, null, {
				length: perPage * 14,
				page: 7,
			});
			expect(block.pagination()).to.be.eql([
				0,
				1,
				2,
				5,
				6,
				7,
				8,
				9,
				10,
				11,
				12,
				13,
			]);

			block = pagination(instance, null, {
				length: perPage * 14,
				page: 8,
			});
			expect(block.pagination()).to.be.eql([
				0,
				1,
				2,
				6,
				7,
				8,
				9,
				10,
				11,
				12,
				13,
			]);

			// Gaps on both sides of current page
			block = pagination(instance, null, {
				length: perPage * 15,
				page: 7,
			});
			expect(block.pagination()).to.be.eql([
				0,
				1,
				2,
				5,
				6,
				7,
				8,
				9,
				12,
				13,
				14,
			]);

			// Same, but with "more" button
			block.more = true;
			expect(block.pagination()).to.be.eql([
				0,
				1,
				2,
				5,
				6,
				7,
				8,
				9,
				12,
				13,
				14,
				'more',
			]);
			expect(block.toObject()).to.be.eql({
				length: perPage * 15,
				page: 7,
				more: true,
			});
		});
	});
})();
