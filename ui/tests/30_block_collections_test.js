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
	const collections = require('../src/core/blocks/collections');
	const helpers = require('../src/core/helpers/collections');

	const chai = require('chai'),
		expect = chai.expect,
		should = chai.should();

	describe('Testing collections block', () => {
		function getRaw() {
			return JSON.parse(
				fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')
			);
		}

		it('tests', () => {
			let instance = Search.init({
					namespace: __filename,
				}),
				block,
				block2,
				data;

			// Empty block without parameters
			block = collections(instance, null, {});

			expect(block.empty()).to.be.equal(true);
			expect(block.hasCategories()).to.be.equal(false);
			expect(block.categories()).to.be.eql([]);
			expect(block.toObject()).to.be.eql({
				showCategories: false,
				collections: {},
			});

			// Simple block
			block = collections(instance, null, {
				collections: helpers.convert(getRaw()),
			});

			expect(block.empty()).to.be.equal(false);
			expect(block.hasCategories()).to.be.equal(true);
			expect(block.categories()).to.be.eql(['General', 'Emoji', 'Thematic']);
			expect(block.toObject()).to.be.eql({
				showCategories: true,
				collections: {
					General: block.collections.General,
					Emoji: block.collections.Emoji,
					Thematic: block.collections.Thematic,
				},
			});

			// Another block
			data = helpers.convert(getRaw());
			block2 = collections(instance, null, {
				collections: data,
			});

			expect(block2.empty()).to.be.equal(false);
			expect(block2.hasCategories()).to.be.equal(true);
			expect(block2.categories()).to.be.eql(['General', 'Emoji', 'Thematic']);
			expect(block.compare(block2)).to.be.equal(true);

			// Block without emojis
			data = helpers.convert(getRaw());
			delete data.Emoji;

			block2 = collections(instance, null, {
				collections: data,
			});

			expect(block2.empty()).to.be.equal(false);
			expect(block2.hasCategories()).to.be.equal(true);
			expect(block2.categories()).to.be.eql(['General', 'Thematic']);
			expect(block.compare(block2)).to.be.equal(false);

			// Block without fa-brands
			data = getRaw();
			delete data['fa-brands'];
			data = helpers.convert(data);

			block2 = collections(instance, null, {
				collections: data,
			});

			expect(block2.empty()).to.be.equal(false);
			expect(block2.hasCategories()).to.be.equal(true);
			expect(block2.categories()).to.be.eql(['General', 'Emoji', 'Thematic']);
			expect(block.compare(block2)).to.be.equal(false);

			// Empty category - no category
			data = getRaw();
			delete data.fa.category;
			data = helpers.convert(data);

			block2 = collections(instance, null, {
				collections: data,
			});

			expect(block2.empty()).to.be.equal(false);
			expect(block2.hasCategories()).to.be.equal(true);
			expect(block2.categories()).to.be.eql([
				'General',
				'Emoji',
				'Thematic',
				'',
			]);
			expect(block.compare(block2)).to.be.equal(false);

			// Empty category - empty string
			data = getRaw();
			data.fa.category = '';
			data = helpers.convert(data);

			block2 = collections(instance, null, {
				collections: data,
			});

			expect(block2.empty()).to.be.equal(false);
			expect(block2.hasCategories()).to.be.equal(true);
			expect(block2.categories()).to.be.eql([
				'General',
				'Emoji',
				'Thematic',
				'',
			]);
			expect(block.compare(block2)).to.be.equal(false);

			// No categories
			data = getRaw();
			Object.keys(data).forEach(prefix => {
				delete data[prefix].category;
			});
			data = helpers.convert(data);

			block2 = collections(instance, null, {
				collections: data,
			});

			expect(block2.empty()).to.be.equal(false);
			expect(block2.showCategories).to.be.equal(false);
			expect(block2.hasCategories()).to.be.equal(false);
			expect(block2.categories()).to.be.eql(['']);
			expect(block.compare(block2)).to.be.equal(false);

			// 1 category, so no categories to show
			data = helpers.convert(getRaw());
			data = helpers.filter(data, item => item.category === 'General');

			block2 = collections(instance, null, {
				collections: data,
			});

			expect(block2.empty()).to.be.equal(false);
			expect(block2.showCategories).to.be.equal(false);
			expect(block2.hasCategories()).to.be.equal(false);
			expect(block2.categories()).to.be.eql(['General']);
			expect(block.compare(block2)).to.be.equal(false);

			// 1 category + empty
			data = getRaw();
			Object.keys(data).forEach(prefix => {
				if (prefix !== 'twemoji') {
					delete data[prefix].category;
				}
			});
			data = helpers.convert(data);

			block2 = collections(instance, null, {
				collections: data,
			});

			expect(block2.empty()).to.be.equal(false);
			expect(block2.showCategories).to.be.equal(true);
			expect(block2.hasCategories()).to.be.equal(true);
			expect(block2.categories()).to.be.eql(['Emoji', '']);
			expect(block.compare(block2)).to.be.equal(false);

			// 1 category, but force showCategories
			data = getRaw();
			Object.keys(data).forEach(prefix => {
				data[prefix].category = 'Foo';
			});
			data = helpers.convert(data);

			block2 = collections(instance, null, {
				collections: data,
				showCategories: true,
			});

			expect(block2.empty()).to.be.equal(false);
			expect(block2.showCategories).to.be.equal(true);
			expect(block2.hasCategories()).to.be.equal(false);
			expect(block2.categories()).to.be.eql(['Foo']);
			expect(block.compare(block2)).to.be.equal(false);

			// Identical to previous for comparison
			data = getRaw();
			Object.keys(data).forEach(prefix => {
				data[prefix].category = 'Foo';
			});
			data = helpers.convert(data);

			block = collections(instance, null, {
				collections: data,
				showCategories: true,
			});

			expect(block.compare(block2)).to.be.equal(true);

			// Test filtering prefixes
			data = helpers.convert(getRaw());
			data = helpers.filter(
				data,
				(item, category, prefix) => prefix.split('-').shift() === 'fa'
			);
			expect(helpers.prefixes(data)).to.be.eql([
				'fa-solid',
				'fa-regular',
				'fa',
				'fa-brands',
			]);

			block2 = collections(instance, null, {
				collections: data,
			});

			expect(block2.empty()).to.be.equal(false);
			expect(block2.hasCategories()).to.be.equal(true);
			expect(block2.categories()).to.be.eql(['General', 'Thematic']);
			expect(block2.toObject()).to.be.eql({
				showCategories: true,
				collections: {
					General: block2.collections.General,
					Thematic: block2.collections.Thematic,
				},
			});
		});
	});
})();
