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

    const chai = require('chai'),
        expect = chai.expect,
        should = chai.should();

    describe('Testing creating instance', () => {
        let nsCounter = 0;

        function customSearch(params, init) {
            if (params.namespace === void 0) {
                params.namespace = __filename + (nsCounter ++)
            }
            let search = Search.init(params);

            search._data.api = fakeAPI(search);
            if (typeof init === 'function') {
                init(search);
            }

            return Search.setup(search);
        }

        function apiParams(prefix) {
            return {
                prefix: prefix,
                info: true,
                chars: true,
                aliases: true
            };
        }

        it('home page', done => {
            let triggered = {},
                view;

            let instance = customSearch({
                events: {
                    'view-loaded': param => {
                        // view-loaded should be called after few ms. it should not be used in production, but testing it anyway
                        expect(param).to.be.equal(view);
                        expect(view.loading).to.be.equal(false);
                        expect(triggered).to.be.eql({
                            'current-view': true
                        });
                        triggered['view-loaded'] = true;
                    },
                    'current-view': param => {
                        // current-view should be triggered when view changes. should be called first, while view is still loading
                        expect(param).to.be.equal(view);
                        expect(view.loading).to.be.equal(true);
                        expect(triggered).to.be.eql({});
                        triggered['current-view'] = true;
                    },
                    'current-view-updated': param => {
                        // current-view-updated should be called after view-loaded, when view has been loaded but not changed
                        expect(param).to.be.equal(view);
                        expect(view.loading).to.be.equal(false);
                        expect(triggered).to.be.eql({
                            'current-view': true,
                            'view-loaded': true
                        });
                        triggered['current-view-updated'] = true;
                        done();
                    },
                    'view-updated': param => {
                        // view-updated should not be called because view-loaded is called instead. it is internal event
                        done('view-updated was called!');
                    }
                }
            }, instance => {
                // Set config
                let config = instance.get('config');
                config.set('itemsPerPage', 48);
                config.set('search.limit', 64);
                config.set('search.fullLimit', 999);
                config.set('viewLoadingDelay', 200);

                // Set API data
                let api = instance.get('api');
                api.setFakeData('collections', {}, JSON.parse(fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')), 10);
            });

            // Check current view
            view = instance.view();
            expect(view).to.not.be.equal(null);
            expect(view.type).to.be.equal('collections');
            expect(view.loading).to.be.equal(true);

            // Test view-loaded event
        });

        it('home page, navigate to collection', done => {
            let triggered = {},
                home, collection;

            let instance = customSearch({
                events: {
                    // Test event listeners as array
                    'current-view': [
                        param => {
                            // current-view should be triggered when view changes. should be called first, while view is still loading
                            if (triggered['current-view'] === void 0) {
                                // called first time for home view
                                expect(param).to.be.equal(home);
                                expect(home.loading).to.be.equal(true);
                                expect(triggered).to.be.eql({});
                                triggered['current-view'] = 1;
                                return;
                            }

                            // called second time for fa-regular
                            expect(param).to.be.equal(collection);
                            expect(collection.loading).to.be.equal(false);
                            expect(triggered).to.be.eql({
                                'current-view': 1,
                                'current-view-updated': 1
                            });
                            triggered['current-view'] ++;

                            let route = {
                                type: 'collection',
                                parent: {
                                    type: 'collections'
                                },
                                params: {
                                    prefix: 'fa-regular'
                                }
                            };
                            expect(instance.getRoute()).to.be.eql(route);
                            expect(instance.toString()).to.be.equal(JSON.stringify(route));
                        },
                        // should be triggered after previous event listener
                        param => {
                            expect(typeof triggered['current-view']).to.be.equal('number');
                            if (triggered['current-view'] === 2) {
                                done();
                            }
                        },
                    ],
                    'current-view-updated': param => {
                        // current-view-updated should be called after view-loaded, when view has been loaded but not changed
                        if (triggered['current-view-updated'] === void 0) {
                            // called first time for home view
                            expect(param).to.be.equal(home);
                            expect(home.loading).to.be.equal(false);
                            expect(triggered).to.be.eql({
                                'current-view': 1
                            });
                            triggered['current-view-updated'] = 1;

                            // navigate to fa-regular via action applied to instance to test instance.action()
                            collection = instance.action('collections', 'fa-regular');
                            expect(collection).to.not.be.equal(null);
                            expect(collection.type).to.be.equal('collection');
                            return;
                        }

                        // This should not happen. Event should not be called for second view because when current-view is called, view should be loaded
                        done('current-view-updated should not be called twice');
                    }
                }
            }, instance => {
                // Set config
                let config = instance.get('config');
                config.set('itemsPerPage', 48);
                config.set('search.limit', 64);
                config.set('search.fullLimit', 999);
                config.set('viewLoadingDelay', 200);

                // Set API data
                let api = instance.get('api');
                api.setFakeData('collections', {}, JSON.parse(fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')), 10);
                api.setFakeData('collection', apiParams('fa-regular'), JSON.parse(fs.readFileSync(__dirname + '/fixtures/fa-regular.json', 'utf8')), 20);
            });

            // Check current view
            home = instance.view();
            expect(home).to.not.be.equal(null);
            expect(home.type).to.be.equal('collections');
            expect(home.loading).to.be.equal(true);
        });

        it('load route', done => {
            let triggered = {},
                view;

            let instance = customSearch({
                // route as string
                route: JSON.stringify({
                    type: 'collection',
                    parent: {
                        type: 'collections'
                    },
                    params: {
                        prefix: 'ant-design'
                    }
                }),
                events: {
                    'current-view': param => {
                        // current-view should be triggered when view changes. should be called first, while view is still loading
                        expect(param).to.be.equal(view);
                        expect(view.loading).to.be.equal(true);
                        expect(triggered).to.be.eql({});
                        triggered['current-view'] = true;
                    },
                    // test event listeners as objects
                    'current-view-updated': {
                        main: param => {
                            // current-view-updated should be called after view-loaded, when view has been loaded but not changed
                            expect(param).to.be.equal(view);
                            expect(view.loading).to.be.equal(false);
                            expect(triggered).to.be.eql({
                                'current-view': true
                            });
                            triggered['current-view-updated'] = true;
                        },
                        extra: param => {
                            expect(triggered).to.be.eql({
                                'current-view': true,
                                'current-view-updated': true
                            });
                            done();
                        }
                    }
                }
            }, instance => {
                // Set config
                let config = instance.get('config');
                config.set('itemsPerPage', 48);
                config.set('search.limit', 64);
                config.set('search.fullLimit', 999);
                config.set('viewLoadingDelay', 200);

                // Set API data
                let api = instance.get('api');
                api.setFakeData('collections', {}, JSON.parse(fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')), 0);
                api.setFakeData('collection', apiParams('ant-design'), JSON.parse(fs.readFileSync(__dirname + '/fixtures/ant-design.json', 'utf8')), 20);
            });

            // Check current view
            view = instance.view();
            expect(view).to.not.be.equal(null);
            expect(view.type).to.be.equal('collection');
            expect(view.loading).to.be.equal(true);

            // Test view-loaded event
        });

        it('load route, different order', done => {
            // same test as before, but load collection from API faster than collections list
            let triggered = {},
                view;

            let instance = customSearch({
                // route as object
                route: {
                    type: 'collection',
                    parent: {
                        type: 'collections'
                    },
                    params: {
                        prefix: 'ant-design'
                    }
                },
                events: {
                    'current-view': param => {
                        // current-view should be triggered when view changes. should be called first, while view is still loading
                        expect(param).to.be.equal(view);
                        expect(view.loading).to.be.equal(true);
                        expect(triggered).to.be.eql({});
                        triggered['current-view'] = true;
                    },
                    'current-view-updated': param => {
                        // current-view-updated should be called after view-loaded, when view has been loaded but not changed
                        expect(param).to.be.equal(view);
                        expect(view.loading).to.be.equal(false);
                        expect(triggered).to.be.eql({
                            'current-view': true
                        });
                        triggered['current-view-updated'] = true;
                        done();
                    }
                },
                config: {
                    itemsPerPage: 32,
                    search: {
                        limit: 64,
                        fullLimit: 900
                    },
                    viewLoadingDelay: 200
                }
            }, instance => {
                // Set API data
                let api = instance.get('api');
                api.setFakeData('collections', {}, JSON.parse(fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')), 20);
                api.setFakeData('collection', apiParams('ant-design'), JSON.parse(fs.readFileSync(__dirname + '/fixtures/ant-design.json', 'utf8')), 0);
            });

            // Check if config has been changed
            expect(instance.get('config').get('itemsPerPage')).to.be.equal(32);
            expect(instance.get('config').get('search.fullLimit')).to.be.equal(900);

            // Check current view
            view = instance.view();
            expect(view).to.not.be.equal(null);
            expect(view.type).to.be.equal('collection');
            expect(view.loading).to.be.equal(true);

            // Test view-loaded event
        });

        it('invalid route', done => {
            let firstCall = true,
                view;

            let instance = customSearch({
                // route as string
                route: JSON.stringify({
                    type: 'collection',
                    parent: {
                        type: 'collections'
                    },
                    params: {
                        prefix: 'invalid-prefix'
                    }
                }),
                events: {
                    'current-view': param => {
                        if (firstCall) {
                            // First time should be called with collection
                            firstCall = false;
                            expect(param).to.be.equal(view);
                            expect(view.loading).to.be.equal(true);
                            return;
                        }

                        // Second time should be called with collections list
                        expect(param).to.not.be.equal(view);
                        expect(param.type).to.be.equal('collections');
                        expect(view.loading).to.be.equal(true);
                        expect(param.loading).to.be.equal(true);
                    },
                    'current-view-updated': param => {
                        expect(firstCall).to.be.equal(false);
                        expect(param.type).to.be.equal('collections');
                        expect(param.loading).to.be.equal(false);
                        done();
                    }
                },
                config: {
                    viewLoadingDelay: 5000,
                    setRouteTimeout: 100,
                    API: {
                        retry: 0
                    }
                }
            }, instance => {
                // Set API data
                let api = instance.get('api');
                api.setFakeData('collections', {}, JSON.parse(fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')), 300);
            });

            // Check current view
            view = instance.view();
            expect(view).to.not.be.equal(null);
            expect(view.type).to.be.equal('collection');
            expect(view.loading).to.be.equal(true);

            // Test view-loaded event
        });

        it('query', done => {
            let triggered = {},
                view;

            let instance = customSearch({
                // query
                query: 'home',
                events: {
                    'current-view': param => {
                        // current-view should be triggered when view changes. should be called first, while view is still loading
                        expect(param).to.be.equal(view);
                        expect(view.loading).to.be.equal(true);
                        expect(triggered).to.be.eql({});
                        triggered['current-view'] = true;
                    },
                    'current-view-updated': param => {
                        // current-view-updated should be called after view-loaded, when view has been loaded but not changed
                        expect(param).to.be.equal(view);
                        expect(view.loading).to.be.equal(false);
                        expect(triggered).to.be.eql({
                            'current-view': true
                        });
                        triggered['current-view-updated'] = true;
                        done();
                    }
                }
            }, instance => {
                // Set config
                let config = instance.get('config');
                config.set('itemsPerPage', 32);
                config.set('search.limit', 64);
                config.set('search.fullLimit', 999);
                config.set('viewLoadingDelay', 200);

                // Set API data
                let api = instance.get('api');
                api.setFakeData('collections', {}, JSON.parse(fs.readFileSync(__dirname + '/fixtures/collections.json', 'utf8')), 0);
                api.setFakeData('search', {
                    query: 'home',
                    limit: 64
                }, JSON.parse(fs.readFileSync(__dirname + '/fixtures/search-home.json', 'utf8')), 20);
            });

            // Check current view
            view = instance.view();
            expect(view).to.not.be.equal(null);
            expect(view.type).to.be.equal('search');
            expect(view.loading).to.be.equal(true);

            // Test view-loaded event
        });
    });
})();
