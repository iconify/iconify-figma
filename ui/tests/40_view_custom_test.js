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
    const Search = require('../src/core/search');
    const fakeAPI = require('./fake_api');
    const customView = require('../src/core/views/custom');

    const chai = require('chai'),
        expect = chai.expect,
        should = chai.should();

    describe('Testing custom view', () => {
        let nsCounter = 0;

        function customSearch(params) {
            if (params.namespace === void 0) {
                params.namespace = __filename + (nsCounter ++)
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
                aliases: true
            };
        }

        it('basic list', done => {
            let instance = customSearch({}),
                events = instance.get('events'),
                viewItem;

            // Set config
            instance.get('config').set('itemsPerPage', 48);

            // Load data
            events.subscribe('load-recent', callback => {
                callback(['mdi:home', 'fa-solid:home']);
            });

            // Subscribe to event
            events.subscribe('view-loaded', view => {
                expect(view).to.be.equal(viewItem);
                expect(view.loading).to.be.equal(false);
                expect(view.empty).to.be.equal(false);

                // Test route
                expect(view.route).to.be.eql({
                    type: 'custom',
                    params: {
                        customType: 'recent',
                        page: 0,
                        search: '',
                        canDelete: false
                    },
                    defaults: {
                        page: 0,
                        search: '',
                        canDelete: false
                    }
                });
                expect(view.getRoute()).to.be.eql({
                    type: 'custom',
                    params: {
                        customType: 'recent'
                    }
                });

                let blocks = view.render();

                // Check pagination block
                expect(blocks.pagination.empty()).to.be.equal(true);
                expect(blocks.pagination.length).to.be.equal(2);
                expect(blocks.pagination.perPage).to.be.equal(48);
                expect(blocks.pagination.page).to.be.equal(0);

                // Check icons block
                expect(blocks.icons.empty()).to.be.equal(false);
                expect(blocks.icons.icons.length).to.be.equal(2);

                // Check for mdi-home
                expect(blocks.icons.icons[0].prefix).to.be.equal('mdi');
                expect(blocks.icons.icons[0].name).to.be.equal('home');

                // Check for fa-solid:home
                expect(blocks.icons.icons[1].prefix).to.be.equal('fa-solid');
                expect(blocks.icons.icons[1].name).to.be.equal('home');

                done();
            });

            // Create view
            viewItem = customView(instance, {
                customType: 'recent'
            }, null);
            expect(viewItem.loading).to.be.equal(true);

            // Test empty render()
            let blocks = viewItem.render();
            expect(blocks.icons.empty()).to.be.equal(true);
            expect(blocks.pagination.empty()).to.be.equal(true);
        });

        it('empty list', done => {
            let instance = customSearch({}),
                events = instance.get('events'),
                viewItem;

            // Load data
            events.subscribe('load-recent', callback => {
                callback([]);
            });

            // Subscribe to event
            events.subscribe('view-loaded', view => {
                expect(view).to.be.equal(viewItem);
                expect(view.loading).to.be.equal(false);
                expect(view.empty).to.be.equal(true);

                let blocks = view.render();

                // Check blocks
                expect(blocks.pagination.empty()).to.be.equal(true);
                expect(blocks.icons.empty()).to.be.equal(true);

                done();
            });

            // Create view
            viewItem = customView(instance, {
                customType: 'recent'
            }, null);
            expect(viewItem.loading).to.be.equal(true);

            // Test empty render()
            let blocks = viewItem.render();
            expect(blocks.icons.empty()).to.be.equal(true);
            expect(blocks.pagination.empty()).to.be.equal(true);
        });

        it('deleting items', done => {
            let instance = customSearch({}),
                events = instance.get('events'),
                items = ['ic:baseline-call', 'ic:outline-call', 'ic:round-call', 'ic:sharp-call'],
                loaded = false,
                deleteEventCalled = false,
                itemsEventCalled = false,
                viewItem;

            // Set config
            instance.get('config').set('itemsPerPage', 48);

            // Load data
            events.subscribe('load-recent', callback => {
                callback(items);
            });

            // Delete icon
            events.subscribe('delete-recent', icon => {
                let value = icon.prefix + ':' + icon.name;
                expect(value).to.be.equal('ic:outline-call');
                deleteEventCalled = true;
                items = items.filter(item => item !== value);
            });

            // Update icons list
            events.subscribe('update-recent', icons => {
                expect(icons.length).to.be.equal(3);
                itemsEventCalled = true;
            });

            // Subscribe to event
            events.subscribe('view-loaded', view => {
                loaded = true;

                expect(view).to.be.equal(viewItem);
                expect(view.loading).to.be.equal(false);
                expect(view.empty).to.be.equal(false);

                let blocks = view.render();

                // Check pagination block
                expect(blocks.pagination.empty()).to.be.equal(true);
                expect(blocks.pagination.length).to.be.equal(4);

                // Check icons block
                expect(blocks.icons.empty()).to.be.equal(false);
                expect(blocks.icons.icons.length).to.be.equal(4);

                // Check for ic:outline-call
                expect(blocks.icons.icons[1].prefix).to.be.equal('ic');
                expect(blocks.icons.icons[1].name).to.be.equal('outline-call');

                // Delete ic-outline-call
                expect(deleteEventCalled).to.be.equal(false);
                expect(itemsEventCalled).to.be.equal(false);

                view.action('delete', 'ic:outline-call');
                expect(deleteEventCalled).to.be.equal(true);
                expect(itemsEventCalled).to.be.equal(true);
            });

            events.subscribe('view-updated', view => {
                expect(view).to.be.equal(viewItem);
                expect(loaded).to.be.equal(true);
                expect(deleteEventCalled).to.be.equal(true);
                expect(itemsEventCalled).to.be.equal(true);

                expect(items).to.be.eql(['ic:baseline-call', 'ic:round-call', 'ic:sharp-call']);

                let blocks = view.render();

                // Check pagination block
                expect(blocks.pagination.empty()).to.be.equal(true);
                expect(blocks.pagination.length).to.be.equal(3);

                // Check icons block
                expect(blocks.icons.empty()).to.be.equal(false);
                expect(blocks.icons.icons.length).to.be.equal(3);

                // Check second item
                expect(blocks.icons.icons[1].prefix).to.be.equal('ic');
                expect(blocks.icons.icons[1].name).to.be.equal('round-call');

                done();
            });

            // Create view
            viewItem = customView(instance, {
                customType: 'recent',
                canDelete: true
            }, null);
        });
    });
})();
