/*global nsntls, troop, module, test, ok, equal, strictEqual, deepEqual, notDeepEqual, raises, expect */
(function () {
    "use strict";

    module("Profile");

    test("Creation", function () {
        var profile = nsntls.Profile.create();

        deepEqual(profile.counters, {}, "Counters' initial state");
    });

    test("Increment", function () {
        var profile = nsntls.Profile.create();

        strictEqual(profile.inc('foo'), profile, "Increment returns self");
        ok(profile.counters.hasOwnProperty('foo'), "New counter added");
        equal(profile.counters.foo, 1, "New counter incremented");

        profile.inc('foo');
        equal(profile.counters.foo, 2, "Counter incremented");

        profile.inc('foo', 3);
        equal(profile.counters.foo, 5, "Counter incremented by 3");
    });

    test("Decrement", function () {
        var profile = nsntls.Profile.create();

        strictEqual(profile.dec('foo'), profile, "Decrement returns self");
        ok(profile.counters.hasOwnProperty('foo'), "New counter added");
        equal(profile.counters.foo, -1, "New counter decremented");

        profile.dec('foo');
        equal(profile.counters.foo, -2, "Counter decreased");

        profile.dec('foo', 3);
        equal(profile.counters.foo, -5, "Counter decreased by 3");
    });

    test("Retrieval", function () {
        var profile = nsntls.Profile.create();

        profile.inc('foo');
        equal(profile.getCount('foo'), profile.counters.foo, "Counter value");
    });

    test("Resetting", function () {
        var profile = nsntls.Profile.create()
            .inc('foo')
            .inc('bar', 5)
            .inc('hello', 2);

        deepEqual(profile.counters, {
            foo  : 1,
            bar  : 5,
            hello: 2
        }, "Counters after initialization");

        profile.reset('hello');
        deepEqual(profile.counters, {
            foo: 1,
            bar: 5
        }, "Hello removed");

        profile.reset();
        deepEqual(profile.counters, {}, "Counters after full reset");
    });

    test("Collection increment", function () {
        var stats = nsntls.ProfileCollection.create();

        // adding first profile and incrementing
        stats
            .setItem('first', nsntls.Profile.create())
            .inc('foo');

        deepEqual(
            stats.getCount('foo').items,
            {
                first: 1
            },
            "First increment"
        );

        // adding new profile and incrementing all
        stats
            .setItem('second', nsntls.Profile.create())
            .inc('foo');

        deepEqual(
            stats.getCount('foo').items,
            {
                first: 2,
                second: 1
            },
            "Second increment"
        );
    });
}());
