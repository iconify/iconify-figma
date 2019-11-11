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
    const Search = require('../src/core/search');

    const chai = require('chai'),
        expect = chai.expect,
        should = chai.should();

    describe('Testing events', () => {
        let nsCounter = 0;

        it('basic event', done => {
            let instance = Search.init({
                    namespace: __filename + (nsCounter ++)
                }),
                events = instance.get('events'),
                delay = false;

            // Subscribe to event
            events.subscribe('foo', () => {
                expect(delay).to.be.equal(false);
                done();
            });

            setTimeout(() => {
                // Fail is tick has passed
                delay = true;
            });

            // Execute event
            events.fire('foo');
        });

        it('delayed event', done => {
            let instance = Search.init({
                    namespace: __filename + (nsCounter ++)
                }),
                events = instance.get('events'),
                delay = false;

            // Subscribe to event
            events.subscribe('foo', () => {
                expect(delay).to.be.equal(true);
                done();
            });

            setTimeout(() => {
                // Success is tick has passed
                delay = true;
            });

            // Execute event
            events.fire('foo', null, true);
        });

        it('multiple listeners', () => {
            let instance = Search.init({
                    namespace: __filename + (nsCounter ++)
                }),
                events = instance.get('events'),
                counters = {
                    first: 0,
                    second: 0
                };

            // Subscribe to event
            events.subscribe('foo', () => {
                counters.first ++;
            });
            events.subscribe('foo', () => {
                counters.second ++;
            });
            expect(events.hasListeners('foo')).to.be.equal(true);

            // Execute event
            events.fire('foo');

            expect(counters).to.be.eql({
                first: 1,
                second: 1
            });
        });

        it('unsubscribe from event', done => {
            let instance = Search.init({
                    namespace: __filename + (nsCounter ++)
                }),
                events = instance.get('events'),
                callback = () => {
                    done('This should not have happened!');
                },
                callback2 = () => {
                    done();
                };

            // Subscribe to event
            events.subscribe('foo', callback);
            events.subscribe('foo', callback, 'key2');
            events.subscribe('bar', callback2.bind(this, 2));

            // Unsubscribe by function
            events.unsubscribe('foo', callback);
            expect(events.hasListeners('foo')).to.be.equal(true);

            // Unsubscribe by key
            events.unsubscribe('foo', 'key2');
            expect(events.hasListeners('foo')).to.be.equal(false);

            // Unsubscribe
            events.unsubscribe('bar', callback2.bind(this, 10)); // different function because of bind()
            expect(events.hasListeners('bar')).to.be.equal(true);

            // Execute events
            events.fire('foo'); // nothing to fire
            events.fire('bar'); // callback2 should be fired once
        });

    });
})();
