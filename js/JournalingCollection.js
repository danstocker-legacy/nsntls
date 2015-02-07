/*global troop, sntls, nsntls */
troop.postpone(nsntls, 'JournalingCollection', function () {
    "use strict";

    var hOP = Object.prototype.hasOwnProperty,
        base = sntls.Collection;

    /**
     * @name nsntls.JournalingCollection.create
     * @function
     * @param {object} [items] Initial contents.
     * @returns {nsntls.JournalingCollection}
     */

    /**
     * Logs all changes in the collection.
     * @class nsntls.JournalingCollection
     * @extends sntls.Collection
     */
    nsntls.JournalingCollection = base.extend()
        .addMethods(/** @lends nsntls.JournalingCollection# */{
            /**
             * @param {object} [items] Initial contents.
             * @ignore
             */
            init: function (items) {
                base.init.apply(this, arguments);

                /**
                 * Collection log. Log entries are plain objects with three properties: "method", "name", and "item".
                 * Property "method" identifies the kind of change, "name" identifies the item that was changed, and
                 * "item" holds the value before the change.
                 * @example
                 * {
                 *  method: 'add', // 'add', 'change', or 'remove'
                 *  name: 'itemName', // name of affected item
                 *  item: {} // item before the change
                 * }
                 * @type {Array}
                 */
                this.log = [];
            },

            /**
             * Sets an item in the collection and logs change.
             * @param {string} itemKey Item key.
             * @param item Item variable / object.
             * @returns {nsntls.JournalingCollection}
             */
            setItem: function (itemKey, item) {
                var isInCollection = hOP.call(this.items, itemKey);

                base.setItem.apply(this, arguments);

                // logging change
                this.log.unshift({
                    method: isInCollection ? 'change' : 'add',
                    key   : itemKey,
                    item  : item // before the change
                });

                return this;
            },

            /**
             * Removes item from the collection and logs change.
             * @param {string} itemKey Item key.
             * @returns {nsntls.JournalingCollection}
             */
            deleteItem: function (itemKey) {
                var isInCollection = hOP.call(this.items, itemKey),
                    oldItem = this.items[itemKey];

                base.deleteItem.apply(this, arguments);

                if (isInCollection) {
                    // adding to log
                    this.log.unshift({
                        method: 'remove',
                        key   : itemKey,
                        item  : oldItem
                    });
                }

                return this;
            },

            /**
             * Clears the entire collection and resets log.
             * @returns {nsntls.JournalingCollection}
             */
            clear: function () {
                base.clear.apply(this, arguments);
                this.resetLog();
                return this;
            },

            /**
             * Resets the log, removing all log entries and thus all references to past items.
             * Since the log holds reference to items that may not be present in the current collection,
             * it is important to reset the log once it's no longer necessary.
             * @returns {nsntls.JournalingCollection}
             */
            resetLog: function () {
                var log = this.log;
                log.splice(0, log.length);
                return this;
            }
        });
});

troop.amendPostponed(sntls, 'Hash', function () {
    "use strict";

    sntls.Hash.addMethods(/** @lends sntls.Hash# */{
        /**
         * Reinterprets hash as a journaling collection.
         * @returns {nsntls.JournalingCollection}
         */
        toJournalingCollection: function () {
            return nsntls.JournalingCollection.create(this.items);
        }
    });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Creates a new JournalingCollection instance based on the current array.
             * @returns {nsntls.JournalingCollection}
             */
            toJournalingCollection: function () {
                return nsntls.JournalingCollection.create(this);
            }
        },
        false, false, false
    );
}());
