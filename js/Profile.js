/*global dessert, troop, sntls, nsntls */
troop.postpone(nsntls, 'Profile', function () {
    "use strict";

    var hOP = Object.prototype.hasOwnProperty;

    /**
     * Instantiates class.
     * @name nsntls.Profile.create
     * @function
     * @returns {nsntls.Profile}
     */

    /**
     * Profiles register a set of counters that may be increased or decreased as a way of gathering statistics.
     * @class nsntls.Profile
     * @extends troop.Base
     */
    nsntls.Profile = troop.Base.extend()
        .addMethods(/** @lends nsntls.Profile# */{
            /**
             * @ignore
             */
            init: function () {
                /**
                 * Registers individual named counters that make up the profile.
                 * @type {object}
                 */
                this.counters = {};
            },

            /**
             * Increases counter either by 1 or `amount` when specified.
             * @param {string} counterName Counter name.
             * @param {number} [amount=1] Amount by which the counter is to be increased.
             * @returns {nsntls.Profile}
             */
            inc: function (counterName, amount) {
                amount = amount || 1;

                var counters = this.counters;

                if (!hOP.call(counters, counterName)) {
                    counters[counterName] = amount;
                } else {
                    counters[counterName] += amount;
                }

                return this;
            },

            /**
             * Decreases counter either by 1 or `amount` when specified.
             * @param {string} counterName Counter name.
             * @param {number} [amount] Amount by which the counter is to be decreased.
             * @returns {nsntls.Profile}
             */
            dec: function (counterName, amount) {
                amount = amount || 1;

                var counters = this.counters;

                if (!hOP.call(counters, counterName)) {
                    counters[counterName] = 0 - amount;
                } else {
                    counters[counterName] -= amount;
                }

                return this;
            },

            /**
             * Retrieves the current value of the specified counter.
             * @param {string} counterName Counter name.
             * @returns {Number} Counter value.
             */
            getCount: function (counterName) {
                return this.counters[counterName] || 0;
            },

            /**
             * Resets the profile by emptying the entire counters buffer, or just one counter.
             * @param {string} [counterName] Name of counter to be reset.
             * @returns {nsntls.Profile}
             */
            reset: function (counterName) {
                if (counterName) {
                    delete this.counters[counterName];
                } else {
                    this.counters = {};
                }
                return this;
            }
        });
});

troop.postpone(nsntls, 'ProfileCollection', function () {
    "use strict";

    /**
     * @name nsntls.ProfileCollection.create
     * @function
     * @param {object} [items] Initial contents.
     * @returns {nsntls.ProfileCollection}
     */

    /**
     * @name nsntls.ProfileCollection#counters
     * @ignore
     */

    /**
     * Shorthand for a (specified) collection of Profile objects.
     * @example
     * var pc = nsntls.ProfileCollection.create();
     * pc.setItem('foo', nsntls.Profile.create());
     * pc.inc('hello');
     * pc.setItem('bar', nsntls.Profile.create());
     * pc.inc('hello');
     * pc.getCounters().items; // {foo: {hello: 2}, bar: {hello: 1}}
     * @class nsntls.ProfileCollection
     * @extends sntls.Collection
     * @extends nsntls.Profile
     */
    nsntls.ProfileCollection = sntls.Collection.of(nsntls.Profile);
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        isProfile: function (expr) {
            return nsntls.Profile.isPrototypeOf(expr);
        },

        isProfileOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   nsntls.Profile.isPrototypeOf(expr);
        },

        isProfileCollection: function (expr) {
            return this.isClass(expr) &&
                   (expr.isA(nsntls.Profile) ||
                    expr.isA(nsntls.ProfileCollection));
        },

        isProfileCollectionOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   this.isClass(expr) &&
                   (expr.isA(nsntls.Profile) ||
                    expr.isA(nsntls.ProfileCollection));
        }
    });
}());
