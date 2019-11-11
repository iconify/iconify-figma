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
    const searchView = require('../src/core/views/search');

    const chai = require('chai'),
        expect = chai.expect,
        should = chai.should();

    describe('Testing search view', () => {
        let nsCounter = 0;

        function customSearch(params) {
            if (params.namespace === void 0) {
                params.namespace = __filename + (nsCounter ++)
            }
            let search = Search.init(params);
            search._data.api = fakeAPI(search);
            return search;
        }

        it('home search', done => {
            let instance = customSearch({}),
                api = instance.get('api'),
                events = instance.get('events'),
                viewItem;

            // Set config
            instance.get('config').set('itemsPerPage', 32);
            instance.get('config').set('search.limit', 64);

            // Set API data
            api.setFakeData('search', {
                query: 'home',
                limit: 64
            }, JSON.parse(fs.readFileSync(__dirname + '/fixtures/search-home.json', 'utf8')), 20);

            // Subscribe to event
            events.subscribe('view-loaded', view => {
                expect(view).to.be.equal(viewItem);
                expect(view.loading).to.be.equal(false);
                expect(view.empty).to.be.equal(false);

                // Test route
                expect(view.route).to.be.eql({
                    type: 'search',
                    params: {
                        search: 'home',
                        page: 0,
                        full: false
                    },
                    defaults: {
                        full: false,
                        page: 0
                    }
                });
                expect(view.getRoute()).to.be.eql({
                    type: 'search',
                    params: {
                        search: 'home'
                    }
                });

                let blocks = view.render();

                // Test collections list
                expect(blocks.collections.empty()).to.be.equal(false);
                expect(blocks.collections.filters).to.be.eql({
                    'ant-design': 'Ant Design Icons',
                    bytesize: 'Bytesize Icons',
                    dashicons: 'Dashicons',
                    el: 'Elusive Icons',
                    entypo: 'Entypo+',
                    'fa-solid': 'Font Awesome 5 Solid',
                    fe: 'Feather Icon',
                    feather: 'Feather Icons',
                    'flat-color-icons': 'Flat Color Icons',
                    foundation: 'Foundation',
                    ic: 'Google Material Icons',
                    'icomoon-free': 'IcoMoon Free',
                    icons8: 'Icons8 Windows 10 Icons',
                    ion: 'IonIcons',
                    jam: 'Jam Icons',
                    maki: 'Maki',
                    map: 'Map Icons',
                    mdi: 'Material Design Icons',
                    'mdi-light': 'Material Design Light',
                    octicon: 'Octicons',
                    oi: 'Open Iconic',
                    raphael: 'Raphael',
                    'si-glyph': 'SmartIcons Glyph',
                    subway: 'Subway Icon Set'
                });

                // Test icons list
                expect(blocks.icons.empty()).to.be.equal(false);
                expect(blocks.icons.icons.length).to.be.equal(32);
                expect(blocks.icons.icons[0]).to.be.eql({
                    prefix: 'ant-design',
                    name: 'home-fill'
                });

                // Pagination block
                expect(blocks.pagination.empty()).to.be.equal(false);
                expect(blocks.pagination.length).to.be.equal(64);
                expect(blocks.pagination.page).to.be.equal(0);
                expect(blocks.pagination.more).to.be.equal(true);

                done();
            });

            // Create view
            viewItem = searchView(instance, {
                search: 'home'
            }, null);
            expect(viewItem.loading).to.be.equal(true);

            // Test empty render()
            let blocks = viewItem.render();
            expect(blocks.collections.empty()).to.be.equal(true);
            expect(blocks.icons.empty()).to.be.equal(true);
            expect(blocks.pagination.empty()).to.be.equal(true);
        });

        it('home search, full results', done => {
            let instance = customSearch({}),
                api = instance.get('api'),
                events = instance.get('events'),
                viewItem;

            // Set config
            instance.get('config').set('itemsPerPage', 32);
            instance.get('config').set('search.fullLimit', 999);

            // Set API data
            api.setFakeData('search', {
                query: 'home',
                limit: 999
            }, JSON.parse(fs.readFileSync(__dirname + '/fixtures/search-home-full.json', 'utf8')), 20);

            // Subscribe to event
            events.subscribe('view-loaded', view => {
                expect(view).to.be.equal(viewItem);
                expect(view.loading).to.be.equal(false);
                expect(view.empty).to.be.equal(false);
                expect(viewItem.ready()).to.be.equal(true);

                // Test route
                expect(view.route).to.be.eql({
                    type: 'search',
                    params: {
                        search: 'home',
                        page: 0,
                        full: true
                    },
                    defaults: {
                        full: false,
                        page: 0
                    }
                });
                expect(view.getRoute()).to.be.eql({
                    type: 'search',
                    params: {
                        search: 'home',
                        full: true
                    }
                });

                let blocks = view.render();

                // Test collections list
                expect(blocks.collections.empty()).to.be.equal(false);
                expect(blocks.collections.filters).to.be.eql({
                    'ant-design': 'Ant Design Icons',
                    bytesize: 'Bytesize Icons',
                    dashicons: 'Dashicons',
                    el: 'Elusive Icons',
                    entypo: 'Entypo+',
                    'fa-solid': 'Font Awesome 5 Solid',
                    fe: 'Feather Icon',
                    feather: 'Feather Icons',
                    'flat-color-icons': 'Flat Color Icons',
                    foundation: 'Foundation',
                    ic: 'Google Material Icons',
                    'icomoon-free': 'IcoMoon Free',
                    icons8: 'Icons8 Windows 10 Icons',
                    ion: 'IonIcons',
                    jam: 'Jam Icons',
                    maki: 'Maki',
                    map: 'Map Icons',
                    mdi: 'Material Design Icons',
                    'mdi-light': 'Material Design Light',
                    octicon: 'Octicons',
                    oi: 'Open Iconic',
                    raphael: 'Raphael',
                    'si-glyph': 'SmartIcons Glyph',
                    subway: 'Subway Icon Set',
                    topcoat: 'TopCoat Icons',
                    typcn: 'Typicons',
                    uil: 'Unicons',
                    vaadin: 'Vaadin Icons',
                    fa: 'Font Awesome 4',
                    ls: 'Ligature Symbols',
                    ps: 'PrestaShop Icons',
                    'simple-line-icons': 'Simple line icons',
                    whh: 'WebHostingHub Glyphs',
                    zmdi: 'Material Design Iconic Font'
                });

                // Test icons list
                expect(blocks.icons.empty()).to.be.equal(false);
                expect(blocks.icons.icons.length).to.be.equal(32);
                expect(blocks.icons.icons[0]).to.be.eql({
                    prefix: 'ant-design',
                    name: 'home-fill'
                });
                expect(blocks.icons.icons[blocks.icons.icons.length - 1]).to.be.eql({
                    prefix: 'maki',
                    name: 'home-15'
                });

                // Pagination block
                expect(blocks.pagination.empty()).to.be.equal(false);
                expect(blocks.pagination.length).to.be.equal(86);
                expect(blocks.pagination.page).to.be.equal(0);
                expect(blocks.pagination.more).to.be.equal(false);

                // Test pagination action: second page
                expect(blocks.pagination.action(1)).to.be.equal(view);

                blocks = view.render();
                expect(blocks.pagination.page).to.be.equal(1);
                expect(blocks.icons.icons.length).to.be.equal(32);
                expect(blocks.icons.icons[0]).to.be.eql({
                    prefix: 'map',
                    name: 'funeral-home'
                });
                expect(blocks.icons.icons[blocks.icons.icons.length - 1]).to.be.eql({
                    prefix: 'si-glyph',
                    name: 'home-page'
                });

                // Test pagination action: third page
                expect(blocks.pagination.action(2)).to.be.equal(view);

                blocks = view.render();

                expect(blocks.pagination.page).to.be.equal(2);
                expect(blocks.icons.icons.length).to.be.equal(22);
                expect(blocks.icons.icons[0]).to.be.eql({
                    prefix: 'subway',
                    name: 'home'
                });
                expect(blocks.icons.icons[blocks.icons.icons.length - 1]).to.be.eql({
                    prefix: 'uil',
                    name: 'tachometer-fast'
                });

                // Test pagination action: wrong page
                expect(blocks.pagination.action(3)).to.be.equal(view);

                blocks = view.render();
                expect(blocks.pagination.page).to.be.equal(2);
                expect(blocks.icons.icons[0]).to.be.eql({
                    prefix: 'subway',
                    name: 'home'
                });

                done();
            });

            // Create view
            viewItem = searchView(instance, {
                // use route params to test different constructors
                routeParams: {
                    search: 'home',
                    full: true
                }
            }, null);
            expect(viewItem.loading).to.be.equal(true);
            expect(viewItem.ready()).to.be.equal(false);

            // Test empty render()
            let blocks = viewItem.render();
            expect(blocks.collections.empty()).to.be.equal(true);
            expect(blocks.icons.empty()).to.be.equal(true);
            expect(blocks.pagination.empty()).to.be.equal(true);
        });

        it('limited prefixes search', done => {
            let instance = customSearch({
                    prefixes: ['fa', 'fa-']
                }),
                api = instance.get('api'),
                events = instance.get('events'),
                viewItem;

            // Set config
            instance.get('config').set('itemsPerPage', 32);
            instance.get('config').set('search.limit', 64);

            // Set API data
            api.setFakeData('search', {
                query: 'home',
                limit: 64,
                prefixes: 'fa,fa-'
            }, JSON.parse(fs.readFileSync(__dirname + '/fixtures/search-fa-home.json', 'utf8')), 20);

            // Subscribe to event
            events.subscribe('view-loaded', view => {
                expect(view).to.be.equal(viewItem);
                expect(view.loading).to.be.equal(false);
                expect(view.empty).to.be.equal(false);
                expect(viewItem.ready()).to.be.equal(true);

                // Test route
                expect(view.route).to.be.eql({
                    type: 'search',
                    params: {
                        search: 'home',
                        page: 0,
                        full: false
                    },
                    defaults: {
                        full: false,
                        page: 0
                    }
                });
                expect(view.getRoute()).to.be.eql({
                    type: 'search',
                    params: {
                        search: 'home'
                    }
                });

                let blocks = view.render();

                // Test collections list
                expect(blocks.collections.empty()).to.be.equal(false);
                expect(blocks.collections.filters).to.be.eql({
                    'fa-solid': 'Font Awesome 5 Solid',
                    fa: 'Font Awesome 4'
                });

                // Test icons list
                expect(blocks.icons.empty()).to.be.equal(false);
                expect(blocks.icons.icons.length).to.be.equal(3);
                expect(blocks.icons.icons).to.be.eql([{
                    prefix: 'fa-solid',
                    name: 'home'
                }, {
                    prefix: 'fa',
                    name: 'home'
                }, {
                    prefix: 'fa-solid',
                    name: 'tachometer-alt'
                }]);

                // Pagination block
                expect(blocks.pagination.empty()).to.be.equal(true);
                expect(blocks.pagination.length).to.be.equal(3);
                expect(blocks.pagination.page).to.be.equal(0);

                done();
            });

            // Create view
            viewItem = searchView(instance, {
                // use params to test different constructors
                search: 'home'
            }, null);
            expect(viewItem.loading).to.be.equal(true);
            expect(viewItem.ready()).to.be.equal(false);

            // Test empty render()
            let blocks = viewItem.render();
            expect(blocks.collections.empty()).to.be.equal(true);
            expect(blocks.icons.empty()).to.be.equal(true);
            expect(blocks.pagination.empty()).to.be.equal(true);
        });

    });
})();
