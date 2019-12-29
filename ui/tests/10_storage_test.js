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
	const Storage = require('../src/core/data/storage');

	const chai = require('chai'),
		expect = chai.expect,
		should = chai.should();

	describe('Testing storage', () => {
		it('Testing types', () => {
			// Dummy class
			let testClassData = {
				foo: 200,
				bar: 201,
			};
			class TestClass {
				constructor() {
					this.data = testClassData;
				}

				test() {
					return this.data.foo;
				}
			}
			let testClassInstance = new TestClass();

			// Data for array
			let defArray = [1, 2, 3];

			// Data for object
			let defObject = {
				foo: 1,
				bar: {
					baz: 2,
				},
			};

			// Create instance
			let data = new Storage({
				def: 'Default value 1',
				def2: 'Default value 2',
				defNum: 3,
				defBool: false,
				defFunc: () => 1,
				defArray: defArray,
				defObject: defObject,
				defClass: testClassInstance,
			});

			// Get default values
			expect(data.get('def')).to.be.equal('Default value 1');
			expect(data.get('def2')).to.be.equal('Default value 2');
			expect(data.get('defNum')).to.be.equal(3);
			expect(data.get('defBool')).to.be.equal(false);
			expect(typeof data.get('defFunc')).to.be.equal('function');
			expect(data.get('defFunc')()).to.be.equal(1);
			expect(data.get('defArray')).to.be.eql(defArray); // Check only contents
			expect(data.get('defArray')).to.be.equal(defArray); // Should be reference
			expect(data.get('defObject')).to.be.eql(defObject); // Check only contents
			expect(data.get('defObject')).to.be.equal(defObject); // Should be reference

			// Test class instance
			let test = data.get('defClass');
			expect(test).to.be.equal(testClassInstance); // Reference

			// Nested object
			expect(data.get('defObject.foo')).to.be.equal(defObject.foo);
			expect(data.get('defObject.foo.baz')).to.be.equal(defObject.foo.baz);

			// Missing items
			expect(data.get('test123')).to.be.equal(void 0);
		});

		it('Changing simple values', () => {
			let defArray = [1, 2, 3];
			let defObject = {
				foo: 1,
				bar: {
					baz: 2,
				},
			};
			let data = new Storage({
				def: 'Default value 1',
				def2: 'Default value 2',
				defNum: 3,
				defBool: false,
				defFunc: () => 1,
				defArray: defArray,
				defObject: defObject,
			});

			// Change existing values
			data.set('def', 'Custom value 1');
			data.set('defNum', 'Not a number');
			data.set('def2', 2);

			// Add new values
			data.set('new-value', 200);
			data.set('new-value2', 'New!');

			// Get values
			expect(data.get('def')).to.be.equal('Custom value 1');
			expect(data.get('def2')).to.be.equal(2);
			expect(data.get('defNum')).to.be.equal('Not a number');
			expect(data.get('new-value')).to.be.equal(200);
			expect(data.get('new-value2')).to.be.equal('New!');

			// Not changed
			expect(data.get('defBool')).to.be.equal(false);
			expect(typeof data.get('defFunc')).to.be.equal('function');
			expect(data.get('defFunc')()).to.be.equal(1);
			expect(data.get('defArray')).to.be.eql(defArray); // Check only contents
			expect(data.get('defArray')).to.be.equal(defArray); // Should be reference
			expect(data.get('defObject')).to.be.eql(defObject); // Check only contents
			expect(data.get('defObject')).to.be.equal(defObject); // Should be reference
		});

		it('Changing objects', () => {
			let defObject = {
				foo: 1,
				bar: {
					baz: 2,
				},
			};
			let data = new Storage({
				foo: 200,
				bar: {
					baz: 100,
				},
				defObject: defObject,
				anotherObject: defObject,
			});

			// Make sure value is a reference
			expect(data.get('defObject')).to.be.equal(data.get('anotherObject'));

			// Change existing values
			data.set('defObject.foo', 'foo?');

			// Variable defObject should have been changed
			expect(defObject.foo).to.be.equal('foo?');

			// defObject and anotherObject should have been changed
			expect(data.get('defObject.foo')).to.be.equal('foo?');
			expect(data.get('anotherObject.foo')).to.be.equal('foo?');

			// Change same data in both objects
			data.set('defObject.bar.baz', 3);
			data.set('anotherObject.bar.baz', 4);
			expect(defObject.bar.baz).to.be.equal(4);
			expect(data.get('defObject.bar.baz')).to.be.equal(4);
			expect(data.get('anotherObject.bar.baz')).to.be.equal(4);
		});

		it('Mix of objects and scalar', () => {
			let data = new Storage({
				foo: 200,
				bar: {
					baz: 100,
				},
				defObject: {
					foo: 1,
					bar: {
						baz: 2,
					},
				},
			});

			// Change existing values
			data.set('defObject.foo', {
				bar2: 111,
			});

			// bar.baz is scalar, so this should fail
			expect(data.set('bar.baz.baz2', 'no changes')).to.be.equal(false);

			// Check changed values
			expect(data.get('bar.baz')).to.be.equal(100);
			expect(data.get('defObject.foo')).to.be.eql({
				bar2: 111,
			});
		});

		it('Expanding object keys', () => {
			let data = new Storage({
				level1: {
					'level2': 1,
					// this should not be used because keys in object are not split
					'level2b.level3': {
						'level4': 2,
						// this should not be used because keys in object are not split
						'level4b.level5': 3,
					},
				},
			});

			// Check if level2b.level3 and level2b.level3 were expanded
			expect(data.get('level1')).to.be.eql({
				'level2': 1,
				'level2b.level3': {
					'level4': 2,
					'level4b.level5': 3,
				},
			});
			expect(data.get('level1.level2b')).to.be.equal(void 0);
		});

		it('Merging objects', () => {
			let data = new Storage({
				test1: {
					foo: 1,
					bar: {
						baz: 2,
						baz2: 3,
						baz3: 4,
					},
				},
			});

			// Merge with another object
			data.merge({
				test1: {
					foo2: 10,
					bar: {
						baz: 11,
						baz4: 12,
					},
				},
				test2: 13,
				test3: {
					test31: 14,
				},
			});

			// Check if test 2 exists (added, not merged)
			expect(data.get('test2')).to.be.equal(13);

			// Check if test 3 exists (added, not merged)
			expect(data.get('test3')).to.be.eql({
				test31: 14,
			});

			// Check if test 1 was merged
			expect(data.get('test1')).to.be.eql({
				foo: 1, // from old object
				foo2: 10, // added
				bar: {
					// merged
					baz: 11, // changed
					baz2: 3, // from old object
					baz3: 4, // from old object
					baz4: 12, // added
				},
			});
		});
	});
})();
