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
"use strict";

(() => {
    const fs = require('fs');
    const functions = require('../src/core/helpers/collection');
    const getIcon = require('../src/core/objects/icon');

    const chai = require('chai'),
        expect = chai.expect,
        should = chai.should();

    describe('Testing icons', () => {
        it('converting icon', () => {
            let icon = getIcon({
                name: 'account-badge-alert',
                prefix: 'mdi',
                // Duplicate tags
                tags: ['Account / User', 'Account / Alert','Account / Alert']
            });
            expect(icon).to.be.eql({
                prefix: 'mdi',
                name: 'account-badge-alert',
                tags: ['Account / User', 'Account / Alert']
            });
        });

        it('converting fa-regular.json', () => {
            let raw = JSON.parse(fs.readFileSync(__dirname + '/fixtures/fa-regular.json', 'utf8')),
                data = functions.convert(raw),
                item;

            // Check for info block
            expect(data.prefix).to.be.equal('fa-regular');
            expect(data.total).to.be.equal(151);
            expect(data.title).to.be.equal('Font Awesome 5 Regular');
            expect(data.author).to.be.eql({
                name: 'Dave Gandy',
                url: 'http://fontawesome.io/'
            });
            expect(data.license).to.be.eql({
                title: 'CC BY 4.0',
                url: 'https://creativecommons.org/licenses/by/4.0/'
            });

            // Should not include themes
            expect(data.themePrefixes).to.be.equal(null);
            expect(data.themeSuffixes).to.be.equal(null);

            // Should have bunch of tags
            expect(data.tags instanceof Array).to.be.equal(true);
            expect(data.tags.length).to.be.equal(52);

            // Should have 151 icons
            expect(data.icons instanceof Array).to.be.equal(true);
            expect(data.icons.length).to.be.equal(151);

            // Find address-book icon that exists in multiple tags
            item = data.icons.filter(icon => icon.name === 'address-book');
            expect(item).to.be.eql([{
                prefix: 'fa-regular',
                name: 'address-book',
                tags: ['Business', 'Communication', 'Users & People']
            }]);
        });

        it('converting ant-design.json', () => {
            let raw = JSON.parse(fs.readFileSync(__dirname + '/fixtures/ant-design.json', 'utf8')),
                data = functions.convert(raw),
                item;

            // Check for info block
            expect(data.prefix).to.be.equal('ant-design');
            expect(data.total).to.be.equal(728);
            expect(data.title).to.be.equal('Ant Design Icons');
            expect(data.author).to.be.eql({
                name: 'HeskeyBaozi',
                url: 'https://github.com/ant-design/ant-design-icons'
            });
            expect(data.license).to.be.eql({
                title: 'MIT'
            });

            // Should not include tags and prefixed themes
            expect(data.tags).to.be.equal(null);
            expect(data.themePrefixes).to.be.equal(null);

            // Should have bunch theme suffixes
            expect(data.themeSuffixes).to.be.eql(['Fill', 'Outline', 'TwoTone']);

            // Should have 728 icons
            expect(data.icons instanceof Array).to.be.equal(true);
            expect(data.icons.length).to.be.equal(728);

            // Test usb-*
            item = data.icons.filter(icon => icon.name.split('-').shift() === 'usb');
            expect(item).to.be.eql([{
                prefix: 'ant-design',
                name: 'usb-fill',
                themeSuffix: 'Fill'
            }, {
                prefix: 'ant-design',
                name: 'usb-outline',
                themeSuffix: 'Outline'
            }, {
                prefix: 'ant-design',
                name: 'usb-twotone',
                themeSuffix: 'TwoTone'
            }]);
        });

        it('converting fa.json', () => {
            let raw = JSON.parse(fs.readFileSync(__dirname + '/fixtures/fa.json', 'utf8')),
                data = functions.convert(raw),
                item;

            // Check for info block
            expect(data.prefix).to.be.equal('fa');
            expect(data.total).to.be.equal(678);
            expect(data.title).to.be.equal('Font Awesome 4');
            expect(data.author).to.be.eql({
                name: 'Dave Gandy',
                url: 'http://fontawesome.io/'
            });
            expect(data.license).to.be.eql({
                title: 'Open Font License',
                url: 'http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL'
            });

            // Should not include tags and themes
            expect(data.tags).to.be.equal(null);
            expect(data.themePrefixes).to.be.equal(null);
            expect(data.themeSuffixes).to.be.equal(null);

            // Should have 678 icons
            expect(data.icons instanceof Array).to.be.equal(true);
            expect(data.icons.length).to.be.equal(678);

            // Test star-half-empty because it has character and multiple aliases
            item = data.icons.filter(icon => icon.name === 'star-half-empty');
            expect(item).to.be.eql([{
                prefix: 'fa',
                name: 'star-half-empty',
                chars: ['f123'],
                aliases: ['star-half-full', 'star-half-o']
            }]);
        });

        it('converting mdi.json', () => {
            let raw = JSON.parse(fs.readFileSync(__dirname + '/fixtures/mdi.json', 'utf8')),
                data = functions.convert(raw),
                item;

            // Check for info block
            expect(data.prefix).to.be.equal('mdi');
            expect(data.total).to.be.equal(4621);
            expect(data.title).to.be.equal('Material Design Icons');

            // Test account-badge-alert because there are multiple tags
            item = data.icons.filter(icon => icon.name === 'account-badge-alert');
            expect(item).to.be.eql([{
                prefix: 'mdi',
                name: 'account-badge-alert',
                tags: ['Account / User', 'Alert / Error']
            }]);
        });

    });
})();
